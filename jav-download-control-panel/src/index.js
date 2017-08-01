// local request client
class LocalRequest {
  static get baseUri() {
    return 'http://localhost:5000/downloader/api/v0.1.0/task';
  }
  static request(method, url, data, onload) {
    return new Promise((resolve, reject) => {
      const payload = {
        url,
        headers: { "Content-Type": "application/json" },
        onerror: function (response) {
          console.log('something wrong while start download task. ');
          reject(response);
        },
        ontimeout: function (response) {
          console.log('request timeout! ');
          reject(response.response);
        },
        onabort: function (response) {
          console.log('request aborted. ');
          reject(response.response);
        }
      };
      if (method) {
        payload.method = method;
      } else {
        payload.method = 'GET';
      }
      if (data && method === 'POST' || method === 'PUT') {
        payload.data = data;
      }
      if (onload) {
        payload.onload = onload;
      } else {
        payload.onload = (response) => {
          resolve(response);
        };
      }
      return GM_xmlhttpRequest(payload);
    });
  }
  static startTask(task) {
    return LocalRequest.request('POST', LocalRequest.baseUri, JSON.stringify(task));
  }
  static listTask(tasks) {
    const queryStr = tasks.join(';');
    return LocalRequest.request('GET', LocalRequest.baseUri + '?names=' + queryStr);
  }
}

// parse page while page load
class PageParser {
  constructor() {
    const currentHref = window.location.href;
    if (/http:\/\/www\.javlibrary\.com\/cn\/\?v=.*/.test(currentHref)) {
      this.type = 'single';
    } else if (/http:\/\/www\.javlibrary\.com\/cn\/vl_.*/.test(currentHref)) {
      this.type = 'video';
    } else {
      this.type = 'home';
    }
    if (this.type === 'single') {
      this.targetElements = [document.getElementById('video_id')];
    } else if (this.type === 'video') {
      this.targetElements = document.getElementsByClassName('video') || [];
    } else {
      this.targetElements = document.getElementsByClassName('post-headline') || [];
    }
  }
  toTasks() {
    if (this.tasks && this.tasks.length) {
      return this.tasks;
    }
    this.tasks = [];
    for (let i = 0; i < this.targetElements.length; i += 1) {
      const elem = this.targetElements[i];
      if (this.type === 'single') {
        this.tasks.push(elem.children[0].children[0].children[0].children[1].textContent);
      } else if (this.type === 'video') {
        this.tasks.push(elem.children[0].children[0].textContent);
      } else {
        this.tasks.push(elem.children[0].textContent);
      }
    }
    return this.tasks;
  }
  get nameElemMap() {
    if (this._nameElemMap) {
      return this._nameElemMap;
    }
    this._nameElemMap = {};
    for (let i = 0; i < this.targetElements.length; i += 1) {
      const elem = this.targetElements[i];
      if (this.type === 'single') {
        const name = elem.children[0].children[0].children[0].children[1].textContent;
        this._nameElemMap[name] = {
          progressBarParent: elem,
          statusBarParent: elem.children[0].children[0].children[0].children[1],
        };
      } else if (this.type === 'video') {
        const name = elem.children[0].children[0].textContent;
        this._nameElemMap[name] = {
          progressBarParent: elem,
          statusBarParent: elem.children[0].children[0],
        };
      } else {
        const name = elem.children[0].textContent;
        this._nameElemMap[name] = {
          progressBarParent: elem,
          statusBarParent: elem.children[0],
        };
      }
    }
    return this._nameElemMap;
  }
}

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

class TokyoToShoMatcher {
  constructor(pageContent) {
    this.pageContent = pageContent;
    this.magnetLinkPattern = /<a href="(magnet:\?xt=urn:btih:.*?)">/gi;
    this.seederCountPattern = /S: <span style="color: .*?">(\d+)<\/span>/gi;
    this.leederCountPattern = /L: <span style="color: .*?">(\d+)<\/span>/gi;
    this.completedCountPattern = /C: <span style="color: .*?">(\d+)<\/span>/gi;
    this.sizePattern = /\| Size: (.*?) \|/gi;
  }
  matchAll() {
    const result = [];
    let [mlMatch, scMatch, lcMatch, ccMatch, szMatch] = [undefined, undefined, undefined, undefined, undefined];
    do {
      [mlMatch, scMatch, lcMatch, ccMatch, szMatch] = [
        this.magnetLinkPattern.exec(this.pageContent),
        this.seederCountPattern.exec(this.pageContent),
        this.leederCountPattern.exec(this.pageContent),
        this.completedCountPattern.exec(this.pageContent),
        this.sizePattern.exec(this.pageContent),
      ];
      if (mlMatch) {
        result.push({
          link: mlMatch[1].trim(),
          sCount: scMatch[1],
          lCount: lcMatch[1],
          cCount: ccMatch[1],
          size: (szMatch && szMatch[1]) || '0MB',
        });
      }
    } while (mlMatch);
    this.magnetLinkPattern.index = this.seederCountPattern.index = this.leederCountPattern.index = this.completedCountPattern.index = this.sizePattern.index = 0;
    return result;
  }
}

class SearchResultFilter {
  constructor(magnets) {
    if (!magnets) {
      this.magnets = [];
    } else {
      this.magnets = magnets;
    }
    this.bestOne = this.magnets.reduce((best, magnet) => {
      const current = {
        link: magnet.link,
        score: (magnet.sCount || 0) * 10 + (magnet.cCount || 0) * 5 + (magnet.lCount || 0) * 2,
        size: parseInt(magnet.size.slice(0, -2), 10) * (magnet.size.indexOf('GB') > -1 ? 1000 : 1),
      };
      if (current.score < best.score) return best;
      const size = parseInt(magnet.size.slice(0, -2), 10) * (magnet.size.indexOf('GB') > -1 ? 1000 : 1);
      if (current.score > best.score) return current;
      if (current.size < best.size) return best;
      return current;
    }, { link: '', score: 0, size: 0 });
  }
  best() {
    return this.bestOne;
  }
}

// Status and progress bar
class DownloadOperationBtnStyle {
  static basic(elementStyle) {
    elementStyle.width = '22px';
    elementStyle.height = '22px';
    elementStyle.boxSizing = 'border-box';
    elementStyle.marginLeft = '4px';
    elementStyle.cursor = 'pointer';
  }
  static unknown(elementStyle) {
    DownloadOperationBtnStyle.basic(elementStyle);
    elementStyle.color = 'white';
    elementStyle.backgroundColor = 'grey';
    elementStyle.borderRadius = '50%';
    elementStyle.padding
  }
  static active(elementStyle) {
    DownloadOperationBtnStyle.basic(elementStyle);
    // elementStyle.backgroundColor = 'green';
  }
  static waiting(elementStyle) {
    DownloadOperationBtnStyle.basic(elementStyle);
    // elementStyle.backgroundColor = 'green';
  }
  static paused(elementStyle) {
    DownloadOperationBtnStyle.basic(elementStyle);
    // elementStyle.backgroundColor = 'orange';
  }
  static removed(elementStyle) {
    DownloadOperationBtnStyle.basic(elementStyle);
    // elementStyle.backgroundColor = 'red';
  }
  static complete(elementStyle) {
    DownloadOperationBtnStyle.basic(elementStyle);
    // elementStyle.backgroundColor = 'red';
    elementStyle.pointer = 'default';
  }
  static error(elementStyle) {
    DownloadOperationBtnStyle.basic(elementStyle);
    // elementStyle.backgroundColor = 'red';
  }
};

const DownloadOperationBtnText = {
  unknown: '⸮',
  active: '⏩',
  waiting: '•',
  paused: '⏸',
  removed: '⌦',
  complete: '🛆',
  error: '❌',
};

const TaskStatusBtnCandidates = {
  'unknown': ['unknown'],
  'active': ['paused', 'removed'],
  'waiting': ['removed'],
  'paused': ['active', 'removed'],
  'removed': ['active'],
  'complete': ['active', 'complete'],
  'error': ['error'],
};

const TaskOperation = {
  unknown: (task) => {
    return (event) => {
      event.preventDefault();
      TokyoToShoRequest.search(task.name).then((response) => {
        const magnets = (new TokyoToShoMatcher(response)).matchAll();
        if (magnets && magnets.length) {
          const best = (new SearchResultFilter(magnets)).best();
          LocalRequest.startTask({ name: task.name, uri: best.link });
        } else {
          alert('无可用资源');
        }
      });
    }
  },
  active: (task) => {
    return (event) => {
      console.log('resume');
    }
  },
  waiting: (task) => {
    return (event) => {
      event.preventDefault();
      console.log('error');
    }
  },
  paused: (task) => {
    return (event) => {
      event.preventDefault();
      console.log('error');
    }
  },
  removed: (task) => {
    return (event) => {
      event.preventDefault();
      console.log('error');
    }
  },
  error: (task) => {
    return (event) => {
      event.preventDefault();
      console.log('error');
    }
  },
  complete: (task) => {
    return (event) => {
      event.preventDefault();
      console.log('error');
    }
  },
};

class DownloadOperationBtn {
  constructor(status) {
    this.btn = document.createElement('div');
    DownloadOperationBtnStyle[status](this.btn.style);
    this.btn.textContent = DownloadOperationBtnText[status];
  }
  bind(action, fn) {
    this.btn.addEventListener(action, fn);
    return this;
  }
  appendTo(parent) {
    parent.appendChild(this.btn);
  }
}

class TaskProgressBar {
  constructor(task) {
    const percentage = (task.completedLength / task.totalLength) * 100;
    this.progressBar = document.createElement('div');
    this.progressBar.style.position = 'absolute';
    this.progressBar.style.top = this.progressBar.style.left = '0';
    this.progressBar.style.width = '100%';
    this.progressBar.style.height = '4px';
    this.progressBar.style.backgroundColor = 'grey';
    const alreadyProgress = document.createElement('div');
    alreadyProgress.style.width = percentage + '%';
    alreadyProgress.style.height = 'inherit';
    alreadyProgress.style.backgroundColor = 'green';
    this.progressBar.appendChild(alreadyProgress);
  }
  appendTo(parent) {
    parent.appendChild(this.progressBar);
  }
}

class TaskStatusBar {
  constructor(task) {
    this.statusBar = document.createElement('section');
    this.statusBar.style.display = 'flex';
    this.statusBar.style.margin = '-4px 0';
    for (const cand of TaskStatusBtnCandidates[task.status]) {
      const btn = new DownloadOperationBtn(cand);
      btn.bind('click', TaskOperation[cand](task)).appendTo(this.statusBar);
    }
  }
  appendTo(parent) {
    parent.style.display = 'flex';
    parent.style.margin = '4px 15%';
    parent.appendChild(this.statusBar);
  }
}

class AE86 {
  constructor() { }
  run() {
    this.loadTasks().then((res) => {
      const taskNameMap = JSON.parse(res.responseText);
      this.initTaskStatElem(taskNameMap);
    });
  }
  initTaskStatElem(taskNameMap) {
    for (const name in taskNameMap) {
      if (taskNameMap.hasOwnProperty(name)) {
        const task = taskNameMap[name];
        const relatedElem = this.pageParser.nameElemMap[name];
        const statusBar = new TaskStatusBar(task);
        statusBar.appendTo(relatedElem.statusBarParent);
        const progressBar = new TaskProgressBar(task);
        progressBar.appendTo(relatedElem.progressBarParent);
      }
    }
  }
  loadTasks() {
    this.pageParser = new PageParser();
    return LocalRequest.listTask(this.pageParser.toTasks());
  }
}
const ae86 = new AE86();
ae86.run();
