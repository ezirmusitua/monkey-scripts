// ==UserScript==
// @name                la-image-extractor
// @name:zh-CN          la 图片地址复制
// @description         copy image source in hitomi.la  notomi.la to clipboard
// @description:zh-CN   复制 hitoma.la  notomi.la 图片链接到剪贴板
// @version             0.1.4
// @author              jferroal
// @license             GPL-3.0
// @require             https://greasyfork.org/scripts/31793-jmul/code/JMUL.js?version=209567
// @include             https://hitomi.la/reader/*
// @include             https://nozomi.la/tag/*
// @run-at              document-idle
// @namespace           https://greasyfork.org/users/34556-jferroal
// ==/UserScript==

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class Button {
  constructor(label, eventHandlers = []) {
    this.element = document.createElement('div');
    this.addCss(Button.DefaultCss);
    this.element.innerText = 'Copy Sources';
    this.listeners = {};
    this.listen(eventHandlers);
    this.parent = null;
  }

  onClick(handler) {
    this.listen({'click': handler});
  }

  listen(handlers) {
    for (const event in handlers) {
      if (handlers.hasOwnProperty(event)) {
        this.element.addEventListener(event, handlers[event]);
      }
    }
  }

  addCss(css) {
    for (const styleName in css) {
      if (css.hasOwnProperty(styleName)) {
        this.element.style[styleName] = css[styleName];
      }
    }
  }

  appendTo(element) {
    this.parent = element;
    element.appendChild(this.element);
  }

  removeFrom() {
    this.parent.removeChild(this.element);
  }

  removeListener() {
    for (const event in this.listeners) {
      if (this.listeners.hasOwnProperty(event)) {
        this.element.removeEventListener(event, this.listeners[event]);
      }
    }
  }
}

Button.DefaultCss = {
  textAlign: 'center',
  width: '120px',
  lineHeight: '40px',
  backgroundColor: 'skyblue',
  color: 'white',
  cursor: 'pointer',
  borderRadius: '8px',
  boxShadow: '0px 0px 8px 4px rgba(0, 0, 0, .2)',
  position: 'fixed',
  right: '80px',
  bottom: '80px'
};

module.exports = Button;

},{}],2:[function(require,module,exports){
const ImgSrcSelector = '.img-url';
const TitleSelector = 'title';
const ADAPOST = false;
const NUMBER_OF_FRONTENDS = 2;

module.exports = function extractImages() {
  let images = Array.from(document.querySelectorAll(ImgSrcSelector));
  const titleElem = document.querySelector(TitleSelector) || {innerText: 'Unknown | Unkonow'};
  let title = encodeURIComponent(titleElem.innerText.split(' | ')[0]);
  const mat = /\/\d*(\d)\.html/.exec(window.location.href);
  let lv = mat && parseInt(mat[1], 10);
  if (!lv || Number.isNaN(lv)) {
    lv = '1';
  }
  const magic = ADAPOST ? 'a' : String.fromCharCode(((lv === 1 ? 0 : lv) % NUMBER_OF_FRONTENDS) + 97);
  images = images.map(s => s.innerText.replace('//g.hitomi.la', `https://${magic}a.hitomi.la`));
  return `${title}\n${images.join('\n')}\n${'= ='.repeat(20)}`;
};

},{}],3:[function(require,module,exports){
const {isHitomi, copyToClipboard} = require('./utils');
const Button = require('./Button');
const extractHitomiImages = require('./hitomi');
const extractNozomiImages = require('./nozomi');

(function () {
  // create button to click
  const btn = new Button('Copy Sources');
  btn.onClick(() => {
    // prepare str2Paste
    let str2paste = '';
    if (isHitomi()) {
      str2paste = extractHitomiImages();
    } else {
      str2paste = extractNozomiImages();
    }
    copyToClipboard(str2paste);
  });
  btn.appendTo(document.body);
})();

},{"./Button":1,"./hitomi":2,"./nozomi":4,"./utils":5}],4:[function(require,module,exports){
const [ImgSrcSelector, TitleSelector] = ['.tag-list-img', 'h1'];

module.exports = function extractNozomiImages() {
  let images = Array.from(document.querySelectorAll(ImgSrcSelector));
  let title = document.querySelector(TitleSelector).innerText;
  images = images.map(s => s.src.replace('//tn', '//i').split('.').slice(0, 4).join('.'));
  return `${title}\n${images.join('\n')}\n${'= ='.repeat(20)}`;
};

},{}],5:[function(require,module,exports){
module.exports = {
  isHitomi() {
    return window && window.location && /hitomi/gi.test(window.location.href);
  },
  isNozomi() {
    return window && window.location && /nozomi.la\/tag/gi.test(window.location.href);
  },
  copyToClipboard(content) {
    const el = document.createElement('textarea');
    el.value = content;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
};

},{}]},{},[3]);
