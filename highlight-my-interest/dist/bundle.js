// ==UserScript==
// @name                highlight-my-interest
// @name:zh-CN          高亮关键词
// @description         highlight keywords in my favorites
// @description:zh-CN   高亮特定网页中感兴趣的关键词
// @version             0.1.8
// @author              jferroal
// @license             GPL-3.0
// @grant               none
// @require             https://greasyfork.org/scripts/31793-jmul/code/JMUL.js?version=208357
// @include             https://sspai.com/*
// @include             https://toutiao.io/*
// @include             http://www.inoreader.com/*
// @run-at              document-end
// @namespace           https://greasyfork.org/users/34556-jferroal
// ==/UserScript==

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const KeywordService = require('./keyword.service');
const TextElement = require('./text-element');

(function () {
    let alreadyLoadedTimes = 0;
    const autoMatchInterval = setInterval(() => {
        if (alreadyLoadedTimes < 100) {
            KeywordService.list().then(function (keywords) {
                TextElement.setKeywords(keywords);
                (TextElement.findAll()).map((e) => e.detect().highlight());
            });
        } else {
            clearInterval(autoMatchInterval);
            console.log('will no match any more');
        }
    }, 1000);
})();

},{"./keyword.service":2,"./text-element":3}],2:[function(require,module,exports){
const InterestedKeywords = [
    "书籍",
    "效率",
    "google",
    "nexus",
    "爬虫",
    "python",
    "angular",
    "node",
    "javascript",
    "ukulele",
    "gtd",
    "工作流",
    "日程",
    "英雄联盟",
    "vps",
    "服务器",
    "书单",
    "免费",
    "限免",
    "数据分析",
    "自由职业",
];

class KeywordService {
    static list(forceLoad = false) {
        return new Promise((resolve) => {
            if (forceLoad) {
                // load from server;
            }
            resolve(KeywordService.InterestedKeywords);
        });

    }
}
KeywordService.InterestedKeywords = InterestedKeywords;

module.exports = KeywordService;
},{}],3:[function(require,module,exports){
let JMUL = window.JMUL || {};
const Map = (list, fn) => {
    let result = [];
    if (list && list.length) {
        for (let i = 0; i < list.length; i += 1) {
            result.push(fn(list[i]));
        }
    }
    return result;
};

class TextElement {
    constructor(element) {
        this.element = new JMUL.Element(element);
        this.shouldHighlight = false;
    }

    detect() {
        for (const keyword of TextElement.keywords) {
            if (this.element.element.innerText.toLocaleLowerCase().indexOf(keyword) < 0) {
                this.shouldHighlight = true;
                break;
            }
        }
        return this;
    }

    highlight() {
        if (this.shouldHighlight) {
            this.element.setCss({
                backgroundColor: '#FFDA5E',
                color: 'black',
            });
        }
    }

    static setKeywords(keywords) {
        TextElement.keywords = keywords;
    }

    static findAll() {
        return TextElement.targetTagNames.reduce((res, tagName) => {
            const tags = document.getElementsByTagName(tagName);
            return res.concat(Map(tags, (e) => new TextElement(e)));
        }, []);
    }
}

TextElement.targetTagNames = ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'a', 'pre', 'blockquote', 'summary'];
module.exports = TextElement;
},{}]},{},[1]);
