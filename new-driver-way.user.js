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
// @grant               GM_xmlhttpRequest
// @run-at              document-start
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

class Matcher {
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
      ];
      if (mlMatch) {
        result.push({
          link: mlMatch[1],
          sCount: scMatch[1],
          lCount: lcMatch[1],
          cCount: ccMatch[1],
          size: (szMatch && szMatch[1]) || '0',
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
  static copyToClipboard(content) {
    document.getSelection().removeAllRanges();
    const range = document.createRange();
    const textarea = document.createElement('textarea');
    textarea.style.display = 'none';
    textarea.value = content;
    document.body.appendChild(textarea);
    range.selectNode(textarea);
    document.getSelection().addRange(range);
    try {
      console.log('123');
      document.execCommand('copy');
      console.log('234');
    } catch (err) {
      console.log('Oops, unable to copy');
    }
    document.getSelection().removeAllRanges();
    document.body.removeChild(textarea);
  }
}

class Truck {
  constructor(carLicense) {
    this.target = `https://www.tokyotosho.info/search.php?terms=${carLicense}`;
  }
  transfer(fn) {
    GM_xmlhttpRequest({
      method: "GET",
      url: this.target,
      headers: HEADERS,
      onreadystatechange: function (response) {
        console.log('trying to get searching result ... ');
      },
      onload: function (response) {
        const matcher = new Matcher(response.response);
        fn(matcher.matchAll());
      },
      onerror: function (response) {
        console.log('something wrong while searching. ');
      },
      ontimeout: function (response) {
        console.log('request timeout! ');
      },
      onabort: function (response) {
        console.log('request aborted. ');
      }
    });
  }
}

class AE86 {
  constructor() { }
  run() {
    this.bindEvent();
  }
  bindEvent() {
    window.addEventListener('mouseup', (event) => {
      this.handleMouseUp(event);
    }, false);
  }
  handleMouseUp(event) {
    const carLicense = (new Selection()).content();
    if (carLicense) {
      const truck = new Truck(carLicense);
      truck.transfer((magnets) => {
        const best = (new Filter(magnets)).best();
        Selection.copyToClipboard(best.link);
      });
    }
  }
}
const car = new AE86();
car.run();
