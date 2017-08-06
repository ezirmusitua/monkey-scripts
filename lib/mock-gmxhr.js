const Events = ['onload', 'onerror', 'onreadystatechange', 'onprogress', 'onabort', 'ontimeout'];
function GM_xmlhttpRequest (options) {
  const req = new XMLHttpRequest();
  for (const key of Events) {
    if (options[key] && typeof options[key] === 'function') {
      req[key] = options[key];
    }
  }
  req.onreadystatechange = () => {
    if (req.readyState === XMLHttpRequest.OPENED) {
      if (options.headers && typeof options.headers === 'object') {
        const headers = options.headers;
        for (const key of Object.keys(headers)) {
          req.setRequestHeader(key, headers[key]);
        }
      }
      // Allow CORS
      req.setRequestHeader('Access-Control-Allow-Origin', '*');
      req.setRequestHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE');
      req.setRequestHeader('Access-Control-Allow-Headers', 'x-requested-with,content-type');
    }
    if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
      req.onload(req.response);
    }
    if (req.readyState === XMLHttpRequest.DONE && req.status > 399) {
      req.onerror(req.response);
    }
    if (req.readyState === XMLHttpRequest.LOADING) {
      req.onprogress(req.response)
    }
    options.onreadystatechange(req.response);
  };
  req.open(options.method, options.url);
  req.send(options.data);
}
