// Search result from tokyotosho
class TokyoToShoRequest {
  static get headers() {
    return {
      ':authority': 'www.tokyotosho.info',
      ':method': 'GET',
      ':path': `/search.php?terms=${this.target}`,
      ':scheme': 'https',
      'accept': 'text / html, application/xhtml+xml,application/xml;q=0.9, image/webp,*/*;q=0.8',
      'accept-encoding;': 'gzip, deflate, sdch, br',
      'accept-language': 'zh-CN, en-US;q=0.8, en;q=0.6, zh;q=0.4',
      'cache-control': 'no-cache',
    };
  }
  static get baseUri() {
    return 'https://www.tokyotosho.info/search.php?terms=';
  }
  static search(target) {
    return new Promise((resolve, reject) => {
      return GM_xmlhttpRequest({
        method: "GET",
        url: TokyoToShoRequest.baseUri + target,
        headers: TokyoToShoRequest.headers,
        onload: function (response) {
          resolve(response.response);
        },
        onerror: function (response) {
          console.log('something wrong while searching. ');
          reject(response.response);
        },
        ontimeout: function (response) {
          console.log('request timeout! ');
          reject(response.response);
        },
        onabort: function (response) {
          console.log('request aborted. ');
          reject(response.response);
        }
      });
    })
  }
}

