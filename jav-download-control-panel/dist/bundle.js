// ==UserScript==
// @name                jav download control panel
// @name:zh-CN          Jav 下载控制台
// @description         Use javlibrary as your video download control panel
// @description:zh-CN   把 javlibrary 作为下载控制台
// @version             0.2.0
// @author              jferroal
// @license             GPL-3.0
// @updateURL           https://github.com/ezirmusitua/my-tamper-monkey-scripts/raw/master/jav-download-control-panel.user.js
// @require             https://greasyfork.org/scripts/31793-jmul/code/JMUL.js?version=209192
// @include             http://www.javlibrary.com/*
// @grant               GM_xmlhttpRequest
// @run-at              document-end
// @namespace           https://greasyfork.org/users/34556
// ==/UserScript==

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const {Element} = window.JMUL || {Element: {}};
const {ClickActionFactory} = require('./elements.logic');

class PanelButton {
    constructor(type, label) {
        this.type = type;
        this.btn = new Element('button');
        this.btn.setInnerText(label);
        this.initStyle();
    }

    initStyle() {
        this.btn.setCss({
            width: '22px',
            height: '22px',
            boxSizing: 'border-box',
            marginLeft: '4px',
            cursor: 'pointer',
        });
    }

    bindClick(task) {
        const gfn = new (ClickActionFactory.create(this.type))(task).cb;
        this.btn.listen('click', (e) => gfn(e, task));
    }

    updateCss(styles) {
        this.btn.setCss(styles);
    }

    appendTo(parent) {
        return this.btn.appendTo(parent);
    }
}

class PanelButtonFactory {
    constructor() {}
    static create(type) {
        switch (type) {
            case 'active':
                return new PanelButton(type, '⏩');
            case 'waiting':
                return new PanelButton(type, '•');
            case 'Paused':
                return new PanelButton(type, '⏸');
            case 'Removed':
                return new PanelButton(type, '⌦');
            case 'Completed':
                return new PanelButton(type, '🛆');
            case 'Error':
                return new PanelButton(type, '❌');
            case 'unknown':
            default:
                const button = new PanelButton(type, '?');
                button.updateCss({
                    color: 'white',
                    backgroundColor: 'grey',
                    borderRadius: '50%',
                });
                return button;
        }
    }
}

PanelButton.instance = undefined;

const TaskStatusBtnCandidates = {
    'unknown': ['unknown'],
    'active': ['paused', 'removed'],
    'waiting': ['removed'],
    'paused': ['active', 'removed'],
    'removed': ['active'],
    'complete': ['active', 'complete'],
    'error': ['error'],
};

class Panel {
    constructor(task) {
        this.element = new Element('section');
        this.initStyles();
        this.initButton(task);
    }

    initStyles() {
        this.element.setCss({
            display: 'flex',
            margin: '-4px 0',
        });
    }

    initButton(task) {
        for (const type of TaskStatusBtnCandidates[task.status]) {
            const button = PanelButtonFactory.create(type);
            button.bindClick(task);
            button.appendTo(this.element);
        }
    }

    appendTo(parent) {
        parent.setCss({
            display: 'flex',
            margin: '4px 15%'
        });
        parent.appendChild(this.element);
    }
}

class ProgressBar {
    constructor(task) {
        const percentage = (task.completedLength / task.totalLength) * 100;
        this.element = new Element('div');
        this.already = new Element('div');
        this.initStyles(percentage);
        this.element.appendChild(this.already);
    }

    initStyles(percentage) {
        this.element.setCss({
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '4px',
            backgroundColor: 'grey',
        });
        this.already.setCss({
            width: percentage + '%',
            height: 'inherit',
            backgroundColor: 'green',
        })
    }

    appendTo(parent) {
        return this.element.appendTo(parent);
    }
}

module.exports = {ProgressBar, Panel};
},{"./elements.logic":2}],2:[function(require,module,exports){
const {TokyoToSho, TaskPanel} = require('./requests');
const {Utils} = require('./utils');

class UnknownClickAction {
    constructor(task) {
        this.task = task;
    }

    get cb() {
        return (event) => {
            event.preventDefault();
            new TokyoToSho().search(this.task.name).then((response) => {
                console.log(response);
                const magnets = (new Utils.TokyoToShoParser(response)).matchAll();
                if (magnets && magnets.length) {
                    this.task.chooseBestMagnet(magnets);
                    new TaskPanel().start(this.task);
                } else {
                    alert('无可用资源');
                }
            });
        }
    }
}

class ActiveClickAction {
    constructor(task) {
        this.task = task;
    }
    get cb() {
        return (event) => {
            event.preventDefault();
            console.log('resume');
        }
    }
}

class WaitingClickAction {
    constructor(task) {
        this.task = task;
    }
    get cb() {
        return (event) => {
            event.preventDefault();
            console.log('resume');
        }
    }
}

class PausedClickAction {
    constructor(task) {
        this.task = task;
    }
    get cb() {
        return (event) => {
            event.preventDefault();
            console.log('resume');
        }
    }
}

class RemovedClickAction {
    constructor(task) {
        this.task = task;
    }
    get cb() {
        return (event) => {
            event.preventDefault();
            console.log('resume');
        }
    }
}

class ErrorClickAction {
    constructor(task) {
        this.task = task;
    }
    get cb() {
        return (event) => {
            event.preventDefault();
            console.log('resume');
        }
    }
}

class CompletedClickAction {
    constructor(task) {
        this.task = task;
    }
    get cb() {
        return (event) => {
            event.preventDefault();
            console.log('resume');
        }
    }
}

class ClickActionFactory {
    constructor() {}

    static create(type) {
        if (!ClickActionFactory.caches[type]) {
            switch (type) {
                case 'active':
                    ClickActionFactory.caches[type] = ActiveClickAction;
                    break;
                case 'waiting':
                    ClickActionFactory.caches[type] = WaitingClickAction;
                    break;
                case 'Paused':
                    ClickActionFactory.caches[type] = PausedClickAction;
                    break;
                case 'Removed':
                    ClickActionFactory.caches[type] = RemovedClickAction;
                    break;
                case 'Completed':
                    ClickActionFactory.caches[type] = CompletedClickAction;
                    break;
                case 'Error':
                    ClickActionFactory.caches[type] = ErrorClickAction;
                    break;
                case 'unknown':
                default:
                    ClickActionFactory.caches[type] = UnknownClickAction;
            }
        }
        return ClickActionFactory.caches[type];
    }
}

ClickActionFactory.caches = {};

module.exports = {ClickActionFactory};
},{"./requests":4,"./utils":6}],3:[function(require,module,exports){
const {Utils} = require('./utils');
const {TaskPanel} = require('./requests');
const {Panel, ProgressBar} = require('./elements');
const {Task} = require('./task');

(function () {
    // const href = window.location.href;
    const href = 'http://www.javlibrary.com/cn/?v=123;';
    const tasks = Utils.generateTasks(href);
    init();
    function init() {
        const taskRequest = new TaskPanel();
        taskRequest.list(Task.joinName(tasks)).then(function (res) {
            const serverTaskNameMap = JSON.parse(res);
            tasks.forEach((task) => {
                task.setServerStatus(serverTaskNameMap[task.name]);
                const statusBar = new Panel(task);
                statusBar.appendTo(task.panelParent);
                const progressBar = new ProgressBar(task);
                progressBar.appendTo(task.progressBarParent);
            })
        });
    }
}());


},{"./elements":1,"./requests":4,"./task":5,"./utils":6}],4:[function(require,module,exports){
// Search result from tokyotosho
const {Request, Header} = window.JMUL || {Request: {}, Header: {}};
const {Task} = require('./task');

class TokyoToSho {
    constructor(_options = {}) {
        if (!TokyoToSho.instance) {
            this.options = _options;
            this.initHeaders();
            this.host = 'https://www.tokyotosho.info';
            TokyoToSho.instance = this;
        }
        return TokyoToSho.instance;
    }

    initHeaders() {
        this.options.headers = new Header({
            ':authority': 'www.tokyotosho.info',
            ':scheme': 'https',
            'accept': 'text / html, application/xhtml+xml,application/xml;q=0.9, image/webp,*/*;q=0.8',
            'accept-encoding;': 'gzip, deflate, sdch, br',
            'accept-language': 'zh-CN, en-US;q=0.8, en;q=0.6, zh;q=0.4',
            'cache-control': 'no-cache',
        });
    }

    search(target) {
        const request = new Request(this.options);
        request.setMethod('GET');
        request.setUrl(this.host + `/search.php?terms=${target}`, ``);
        return request.send();
    }
}

TokyoToSho.instance = undefined;

class TaskPanel {
    constructor(_options = {}) {
        if (!TaskPanel.instance) {
            this.options = _options;
            this.initHeaders();
            this.host = 'http://localhost:5000/downloader/api/v0.1.0/task';
            TaskPanel.instance = this;
        }
        return TaskPanel.instance;
    }

    initHeaders() {
        this.options.headers = new Header({'Content-Type': 'application/json'});
    }

    start(task) {
        console.log(this.options);
        const request = new Request(this.options);
        request.setMethod('POST');
        request.setUrl(this.host);
        request.setData(task.json());
        return request.send();
    }

    list(taskStr) {
        const request = new Request(this.options);
        request.setMethod('GET');
        request.setUrl(`${this.host}?names=${taskStr}`);
        return request.send();
    }
}

TaskPanel.instance = undefined;

if (window.DEBUG_MODE) {
    console.log('DEBUG MODE');
    TokyoToSho.prototype.search = function () {
        return Promise.resolve(`
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head><meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<title>Tokyo Toshokan :: #tokyotosho @ irc.rizon.net :: Torrent Search</title><link rel="stylesheet" type="text/css" href="https://ttcdn.info/css12.php" title="Default" />
		<link rel="alternate stylesheet" type="text/css" href="https://ttcdn.info/css_inverse.php" title="Inverse" />
	<link rel="icon" type="image/png" href="https://ttcdn.info/favicon.png" />
	
	<link rel="shortcut icon" href="https://www.tokyotosho.info/favicon.ico" /><link rel="stylesheet" type="text/css" href="https://ttcdn.info/20130401/clippyjs/build/clippy.css" media="all" /><link rel="alternate" title="Tokyo Toshokan RSS" href="rss.php" type="application/rss+xml" />
	<link rel="search" type="application/opensearchdescription+xml" title="Tokyo Toshokan" href="/tokyotosho-search.php" /></head><body><script type="text/javascript" src="https://ttcdn.info/styleswitcher.js"></script><div id="main">
<h1>Tokyo <span title="Japanese: Libary">Toshokan</span></h1>
<div class="centertext">東京 図書館</div>
<h2><a class="h2" style="font-size: 9pt" href="irc://irc.rizon.net/tokyotosho">#tokyotosho @ irc.rizon.net</a><br />
<span style="font-size: 8pt"><a href="http://tokyotosho.info">http://tokyotosho.info</a> <a href="http://tokyotosho.se">http://tokyotosho.se</a> <a href="http://tokyo-tosho.net">http://tokyo-tosho.net</a></span>
</h2>
<h3>A BitTorrent <span title="English: Toshokan">Library</span> for Japanese Media</h3>

<ul class="menuwrapper">
<li class="menu"><a class="head" title="Lost?" href="index.php">Home</a> (<a class="head" href="https://www.tokyotosho.info/">SSL</a>) ::</li>
<li class="menu"><a class="head" href="settings.php">Customize</a> ::</li>
<li class="menu"><a class="head" href="login.php">Register/Login</a> ::</li>
<li class="menu"><a class="head" title="Tell us about a torrent we don't know about" href="new.php">Submit New Torrent</a> ::</li>
<li class="menu"><a class="head" title="We probably have what you're looking for!" href="search.php">Search</a> ::</li>
<li class="menu"><a class="head" title="Keep on top of the releases" href="rss.php">RSS</a> (<a class="head" title="Or just some of the releases" href="rss_customize.php">Customize</a>)<br /></li>
<li class="menu"><a class="head" title="Documents!" href="/pico">Docs</a> ::</li>
<li class="menu"><a class="head" title="Chat or idle with us on IRC" href="irc://irc.rizon.net/tokyotosho">Chat</a> ::</li>
<li class="menu"><a class="head" title="It's teh moniez" href="/donate.php">Donate!</a> ::</li>
<li class="menu"><a class="head" title="Let's hear from you!" href="/contact.php">Contact</a> ::</li>
<li class="menu"><strong><a class="head" href="https://www.privateinternetaccess.com/pages/protect-tt/">VPN Service</a></strong> ::</li>
<li class="menu"><a class="head" href="http://idlerpg.tokyotosho.info">IdleRPG</a> ::</li>
<li class="menu"><a class="head" title="Off site status page" href="http://status.tokyotosho.info">Status Page</a></li>
</ul>
<table class="centertext" style="width: 100%; margin-left: auto; margin-right: auto; padding-bottom: 1em; margin: 0;">
<tr><td id="tsearch">Torrent Search</td></tr>
</table>
<p class="centertext"><a href="https://www.privateinternetaccess.com/pages/protect-tt/"><img alt="Private Internet Access" src="https://ttcdn.info/pia_wide.png" /></a></p>	<form style="margin: 0; padding; 0" action="/search.php" method="get" accept-charset="utf-8">
	<table class="centertext" cellspacing="0" cellpadding="0" style="width: 100%; padding-bottom: 1em; margin: 0;">
	<tr><td>
	<input size="60" type="text" name="terms" value="SNIS910" />
	<select name="type">
	<option value="0">All</option>
	<option value="1">Anime</option><option value="10">Non-English</option><option value="3">Manga</option><option value="8">Drama</option><option value="2">Music</option><option value="9">Music Video</option><option value="7">Raws</option><option value="4">Hentai</option><option value="12">Hentai (Anime)</option><option value="13">Hentai (Manga)</option><option value="14">Hentai (Games)</option><option value="11">Batch</option><option value="15">JAV</option><option value="5">Other</option>	</select><br />
	<input type="checkbox" name="searchName" value="true" checked="checked" id="searchName" /><label for="searchName">Search name</label>
	<span style="font-variant: small-caps;">Or</span>
	<input type="checkbox" name="searchComment" value="true" checked="checked" id="searchComment" /><label for="searchComment">Search comment</label><br />
	<label for="minMB">Torrent Size (Min MB):</label>
	<input id="minMB" size="4" type="text" name="size_min" value="" />
	<label for="maxMB">(Max MB):</label>
	<input size="4" type="text" name="size_max" id="maxMB" value="" />
	<br /><label for="submitter">Submitter:</label>
	<input id="submitter" size="12" type="text" name="username" value="" /><br />
	<input type="submit" value="Search" /><br />
	</td></tr>
	</table>
	</form>
	<table class="listing">
<tr><td class="centertext" colspan="3"><a href="/rss.php?terms=SNIS910&amp;type=0&amp;searchName=true&amp;searchComment=true&amp;size_min=&amp;size_max=&amp;username="><img src="https://ttcdn.info/feed-icon-14x14.png" alt="RSS" /> RSS Feed of these results</a></td></tr><tr class="shade category_0"><td rowspan="2"><a href="/?cat=15"><img class="icon" alt="JAV" src="https://ttcdn.info/cat_jav5.png" /></a></td><td class="desc-top"><a href="magnet:?xt=urn:btih:EOJZPIL47X2CUFO3ZOROAGDKIZENKJDI&amp;tr=udp%3A%2F%2F9.rarbg.com%3A2710%2Fannounce&amp;tr=udp%3A%2F%2F9.rarbg.me%3A2710%2Fannounce&amp;tr=udp%3A%2F%2Fmgtracker.org%3A2710%2Fannounce&amp;tr=http%3A%2F%2Ftracker.tfile.me%2Fannounce&amp;tr=http%3A%2F%2Fopen.acgtracker.com%3A1096%2Fannounce&amp;tr=http%3A%2F%2Fmgtracker.org%3A2710%2Fannounce&amp;tr=udp%3A%2F%2Ftracker.ex.ua%3A80%2Fannounce&amp;tr=http%3A%2F%2Fwww.365shares.net&amp;tr=http%3A%2F%2Fwww.2121.club&amp;tr=http%3A%2F%2F88files.net&amp;tr=http%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce"><span class="sprite_magnet"></span></a> <a rel="nofollow" type="application/x-bittorrent" href="https://onejav.com/goto/t/snis910">SNIS-910</a></td><td class="web"><a href="https://onejav.com/torrent/snis910">Website</a> | <a rel="nofollow" href="details.php?id=1096063">Details</a></td></tr><tr class="shade category_0"><td class="desc-bot">Submitter: Anonymous | Size: 1.39GB | Date: 2017-05-16 07:00 UTC | Comment: https://onejav.com - SNIS910 Aoi - Big Tits, Bride, Young Wife, Cuckold, Kiss, Married Woman, Risky Mosaic, Solowork</td><td align="right" style="color: #BBB; font-family: monospace" class="stats">S: <span style="color: red">0</span> L: <span style="color: red">0</span> C: <span style="color: red">0</span> ID: 1096063</td></tr></table><p style="text-align: center">Returned 1 result.</p><form action="/search.php" method="get" accept-charset="utf-8">
<table class="centertext" cellspacing="0" cellpadding="0" style="width: 100%; padding-bottom: 1em; margin: 0;">
<tr><td>
<label for="terms2">Search Terms:</label>
<input id="terms2" size="60" type="text" name="terms" value="" />
<select name="type">
<option value="0">All</option>
<option value="1">Anime</option>
<option value="10">Non-English</option>
<option value="8">Drama</option>
<option value="3">Manga</option>
<option value="2">Music</option>
<option value="9">Music-Video</option>
<option value="7">Raws</option>
<option value="4">Hentai</option>
<option value="11">Batch</option>
<option value="5">Other</option>
</select><br />
<input type="checkbox" name="searchName" value="true" checked="checked" id="searchName2" /><label for="searchName2">Search name</label>
<span style="font-variant: small-caps;">Or</span>
<input type="checkbox" name="searchComment" value="true" checked="checked" id="searchComment2" /><label for="searchComment2">Search comment</label><br />
<label for="minMB2">Torrent Size (Min MB):</label><input id="minMB2" size="4" type="text" name="size_min" value="" />
<label for="maxMB2">(Max MB):</label><input id="maxMB2" size="4" type="text" name="size_max" value="" /><br />
<label for="submitter2">Submitter:</label><input size="12" type="text" name="username" value="" id="submitter2" /><br />
<input type="submit" value="Search" /><br />
</td></tr>
</table>
</form>
</div><p class="footer">
<a href="https://www.privateinternetaccess.com/pages/protect-tt/"><img alt="Private Internet Access" src="https://ttcdn.info/pia.png" /></a><br />
<br />
Rolling visitor numbers <br />IPv4: 24h [47,198] 60min [3,632] 5min [486] 1min [143] - 5 minute rolling average [857]<br />
IPv6: 24h [12,795] 60min [925] 5min [97] 1min [21] - 5 minute rolling average [172]

<br />Hosted at:<br />
<a href="http://serioustubes.org/"><img alt="Serious Tubes" src="https://ttcdn.info/serioustubes.png" /></a><br />Page generated in 202ms.<br />You are connecting from: 140.207.25.100 <b>SSL</b><b> (SNI supported)</b></p></body></html>
    `);
    };
}


module.exports = { TokyoToSho, TaskPanel};

},{"./task":5}],5:[function(require,module,exports){
const {Element} = window.JMUL || {JMElement: {}};

class Task {
    constructor(name = '') {
        this.name = name;
    }

    setName(name) {
        this.name = name;
    }

    setPanelParent(el) {
        this.panelParent = new Element(el);
    }

    setProgressBarParent(el) {
        this.progressBarParent = new Element(el);
    }

    setMagnetLink(magnet) {
        this.magnet = magnet;
    }

    chooseBestMagnet(magnets) {
        this.setMagnetLink(magnets.reduce((best, magnet) => {
            const current = {
                link: magnet.link,
                score: (magnet.sCount || 0) * 10 + (magnet.cCount || 0) * 5 + (magnet.lCount || 0) * 2,
                size: parseInt(magnet.size.slice(0, -2), 10) * (magnet.size.indexOf('GB') > -1 ? 1000 : 1),
            };
            if (current.score < best.score) return best;
            if (current.score > best.score) return current;
            if (current.size < best.size) return best;
            return current;
        }, {link: '', score: 0, size: 0}));
    }

    setServerStatus(serverTask) {
        this.completedLength = serverTask.completedLength;
        this.totalLength = serverTask.totalLength;
        this.status = serverTask.status;
    }

    json() {
        return {
            name: this.name,
            magnet: this.magnet.link
        }
    }

    static joinName(tasks) {
        return tasks.reduce((res, t) => res += t.name + ';', '');
    }

    static fromSingleElem(elem) {
        const task = new Task();
        task.setName(elem.children[0].children[0].children[0].children[1].textContent);
        task.setPanelParent(elem);
        task.setProgressBarParent(elem.children[0].children[0].children[0].children[1]);
        return task;
    }

    static fromListElem(elem) {
        const task = new Task();
        task.setName(elem.children[0].children[0].textContent);
        task.setPanelParent(elem);
        task.setProgressBarParent(elem.children[0].children[0]);
        return task;
    }

    static fromHomeElem(elem) {
        const task = new Task();
        task.setName(elem.children[0].textContent);
        task.setPanelParent(elem);
        task.setProgressBarParent(elem.children[0]);
        return task;
    }
}

module.exports = {Task};
},{}],6:[function(require,module,exports){
const {Task} = require('./task');

const PageType = {
    SINGLE_VIEW: 100,
    VIDEO_LIST: 200,
    HOMEPAGE: 300,
};

class Utils {
    static pageType(href) {
        if (/http:\/\/www\.javlibrary\.com\/cn\/\?v=.*/.test(href)) {
            return PageType.SINGLE_VIEW;
        }
        if (/http:\/\/www\.javlibrary\.com\/cn\/vl_.*/.test(href)) {
            return PageType.VIDEO_LIST;
        }
        return PageType.HOMEPAGE;
    }

    static getTaskElements(type) {
        switch (type) {
            case PageType.SINGLE_VIEW:
                return [document.getElementById('video_id')];
            case PageType.VIDEO_LIST:
                return document.getElementsByClassName('video') || [];
            case PageType.HOMEPAGE:
            default:
                return document.getElementsByClassName('post-headline') || [];
        }
    }

    static generateTasks(href) {
        const type = Utils.pageType(href);
        const elements = Utils.getTaskElements(type);
        return elements.reduce((res, e) => {
            switch (type) {
                case PageType.SINGLE_VIEW:
                    res.push(Task.fromSingleElem(e));
                    break;
                case PageType.VIDEO_LIST:
                    res.push(Task.fromListElem(e));
                    break;
                case PageType.HOMEPAGE:
                default:
                    res.push(Task.fromHomeElem(e));
                    break;
            }
            return res;
        }, []);
    }
}

Utils.PageType = PageType;
Utils.TokyoToShoParser = class TokyoToShoParser {
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
        this.magnetLinkPattern.index = this.seederCountPattern.index = this.leederCountPattern.index = 0;
        this.completedCountPattern.index = this.sizePattern.index = 0;
        return result;
    }
};

module.exports = {Utils};
},{"./task":5}]},{},[3]);
