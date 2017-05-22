// ==UserScript==
// @name                new driver way
// @name:zh-CN          新手老司机
// @description         make it simple to use javlibrary and tokyo tosho
// @description:zh-CN   在 javlibrary 中寻找感兴趣的内容直接通过 tokyo 获得 磁链地址
// @version             0.1.0
// @author              jferroal
// @license             GPL-3.0
// @updateURL           https://github.com/ezirmusitua/my-tamper-monkey-scripts/raw/master/new-driver-way.user.js
// @include             http://www.javlibrary.com/*
// @include             https://www.baidu.com/*
// @grant               GM_xmlhttpRequest
// @run-at              document-end
// @namespace           https://greasyfork.org/users/34556
// ==/UserScript==

const HEADERS = {
  ':authority': 'www.tokyotosho.info',
  ':method': 'GET',
  ':path': `/search.php?terms=${this.target}`,
  ':scheme': 'https',
  'accept': 'text / html, application/xhtml+xml,application/xml;q=0.9, image/webp,*/*;q=0.8',
  'accept-encoding;': 'gzip, deflate, sdch, br',
  'accept-language': 'zh-CN, en-US;q=0.8, en;q=0.6, zh;q=0.4',
  'cache-control': 'no-cache',
};

class LocalRequest {
  static get baseUri() {
    return 'http://localhost:5000/downloader/api/v0.1.0/task';
  }
  static request(method, url, data, onload) {
    return new Promise((resolve, reject) => {
      const payload = {
        url,
        headers: { "Content-Type": "application/json" },
        onreadystatechange: function (response) {
          console.log('trying to start download task ... ');
        },
        onerror: function (response) {
          console.log('something wrong while start download task. ');
          reject(response);
        },
        ontimeout: function (response) {
          console.log('request timeout! ');
        },
        onabort: function (response) {
          console.log('request aborted. ');
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
          console.log('task started! ');
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


class PageParser {
  constructor() {
    const currentHref = window.location.href;
    this.type = /http:\/\/www\.javlibrary\.com\/cn\/\?v=.*/.test(currentHref) ? 'single' : 'multi';
    if (this.type === 'single') {
      this.targetElements = [document.getElementById('video_id')];
    } else {
      this.targetElements = document.getElementsByClassName('post-headline') || [];
    }
    console.log(this.targetElements);
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

class Filter {
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


class Selection {
  constructor() {
    this.selectionText = document.getSelection().toString();
  }
  content(previousContent) {
    return this.selectionText;
  }
  static copyToClipboard(textarea) {
    document.getSelection().removeAllRanges();
    const range = document.createRange();
    range.selectNode(textarea);
    document.getSelection().addRange(range);
    try {
      document.execCommand('copy');
    } catch (err) {
      console.log('Oops, unable to copy');
    }
    document.getSelection().removeAllRanges();
  }
}

class DownloadOperationBtnStyle {
  static basic(elementStyle) {
    elementStyle.width = '20px';
    elementStyle.height = '20px';
    elementStyle.boxSizing = 'border-box';
    elementStyle.marginLeft = '4px';
    elementStyle.cursor = 'pointer';
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
  waiting: '⏩',
  paused: '⏸',
  removed: '⌦',
  complete: '🛆',
  error: '❌',
};

const TaskStatusBtnCandidates = {
  'waiting': ['paused', 'removed'],
  'paused': ['waiting', 'removed'],
  'removed': ['waiting'],
  'complete': ['waiting', 'complete'],
  'error': ['waiting', 'error'],
};

const TaskOperation = {
  'waiting': (task) => {
    console.log('waiting');
  },
  'error': (task) => {
    console.log('error');
  }
}

class DownloadOperationBtn {
  constructor(status) {
    this.btn = document.createElement('div');
    DownloadOperationBtnStyle[status](this.btn.style);
    this.btn.textContent = DownloadOperationBtnText[status];
  }
  bind(action, fn) {
    console.log(fn)
    this.btn.addEventListener(action, fn);
    return this;
  }
  appendTo(parent) {
    parent.appendChild(this.btn);
  }
}

class TaskProgressBar {
  constructor(task) {
    const percentage = (task.completedLength / task.length) * 100;
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
      console.log(TaskOperation[cand]);
      btn.bind('click', TaskOperation[cand]).appendTo(this.statusBar);
    }
  }
  appendTo(parent) {
    parent.style.display = 'flex';
    parent.style.margin = '4px 0';
    parent.appendChild(this.statusBar);
  }
}


class AE86 {
  constructor() { }
  run() {
    this.loadTasks();
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
    LocalRequest.listTask(this.pageParser.toTasks()).then((res) => {
      const taskNameMap = JSON.parse(res.responseText);
      this.initTaskStatElem(taskNameMap);
    });
  }
}
const car = new AE86();
car.run();
