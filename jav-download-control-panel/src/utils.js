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