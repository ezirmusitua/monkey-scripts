// ==UserScript==
// @name                annotation-board
// @name:zh-CN          注释墙
// @description         allow you to add annotation after selected content and copy to clipboard and save to local server
// @description:zh-CN   选中内容后添加注释并复制到剪贴板, 同时在本地的服务其中新建一个副本, 参见 https://github.com/ezirmusitua/snippet-board
// @version             0.1.5
// @author              jferroal
// @license             GPL-3.0
// @updateURL           https://github.com/ezirmusitua/my-tamper-monkey-scripts/raw/master/annotation-board.user.js
// @include             http://*
// @include             https://*
// @grant               GM_xmlhttpRequest
// @run-at              document-start
// @namespace           https://greasyfork.org/users/34556
// ==/UserScript==

function createSnippet(snippetContent, _host, _port) {
  let host = _host;
  if (!host) {
    host = 'http://127.0.0.1';
  }
  var port = _port;
  if (!port) {
    port = 5000;
  }
  const body = {
    link: window.location.href,
    raw_content: snippetContent,
  }
  GM_xmlhttpRequest({
    method: "POST",
    url: host + ':' + port.toString() + "/snippet/api/v0.1.0",
    data: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    onreadystatechange: function (response) {
      console.log('trying to create snippet ... ');
    },
    onload: function (response) {
      console.log('snippet created! ');
    },
    onerror: function (response) {
      console.log('something wrong while creating snippet. ');
    },
    ontimeout: function (response) {
      console.log('request timeout! ');
    },
    onabort: function (response) {
      console.log('request aborted. ');
    }
  });
}

class AnnotationBoardStyle {
  constructor() { }
  static containerStyle(containerStyleObj, position) {
    containerStyleObj.fontFamily = 'Noto';
    containerStyleObj.display = 'flex';
    containerStyleObj.flexDirection = 'column';
    containerStyleObj.border = '4px';
    containerStyleObj.boxShadow = '0px 3px 8px 1px rgba(0, 0, 0, 0.26)';
    containerStyleObj.position = 'absolute';
    containerStyleObj.backgroundColor = 'rgba(0, 0, 0, 0.56)';
    containerStyleObj.padding = '16px 4px 8px 4px';
  }
  static textareaStyle(textareaStyleObj) {
    textareaStyleObj.fontFamily = 'Noto';
    textareaStyleObj.width = '240px';
    textareaStyleObj.height = '128px';
    textareaStyleObj.backgroundColor = 'rgba(255, 255, 255, 0.87)';
    textareaStyleObj.marginBottom = '8px';
    textareaStyleObj.borderRadius = '4px';
    textareaStyleObj.color = 'rgba(0, 0, 0, 0.76)'
    textareaStyleObj.fontSize = '12px';
  }
  static saveButtonStyle(buttonStyleObj) {
    buttonStyleObj.fontFamily = 'Noto';
    buttonStyleObj.border = 'none';
    buttonStyleObj.borderRadius = '4px';
    buttonStyleObj.height = '24px';
    buttonStyleObj.backgroundColor = 'rgba(255, 255, 255, 0.87)'
    buttonStyleObj.color = 'rgba(0, 0, 0, 0.76)'
    buttonStyleObj.fontSize = '14px';
  }
}

const formatDate = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const date = dateObj.getDate();
  const hour = dateObj.getHours();
  const minute = dateObj.getMinutes();
  return `Date: ${year}-${month + 1}-${date}[${hour}:${minute > 9 ? minute : '0' + minute}]`;
}

const AnnotationBoardId = {
  CONTAINER: 'annotation-container',
  TEXTAREA: 'annotation-textarea',
  BUTTON: 'annotation-button'
};

class Selection {
  constructor() {
    this.createAtStr = formatDate(new Date());
    this.selectionText = document.getSelection().toString();
  }
  concat() {
    return this.createAtStr + '\n' + `Content: \n${this.selectionText}`;
  }
  content(previousContent) {
    if (previousContent) {
      return previousContent + '\n' + '========' + '\n' + this.concat() + '\n';
    } else {
      return this.concat() + '\n';
    }
  }
  isEmpty() {
    return !this.selectionText;
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

class Position {
  constructor(rect, offset) {
    this._left = (rect.left + (offset || 32)) + 'px';
    this._top = (rect.top + (offset || 16)) + 'px';
  }
  top() {
    return this._top;
  }
  left() {
    return this._left;
  }
}

class AnnotationTextArea {
  constructor() {
    this.container = document.createElement('div');
    this.container.id = AnnotationBoardId.CONTAINER;
    AnnotationBoardStyle.containerStyle(this.container.style);
    this.textarea = document.createElement('textarea');
    this.textarea.id = AnnotationBoardId.TEXTAREA;
    AnnotationBoardStyle.textareaStyle(this.textarea.style);
    this.saveBtn = document.createElement('button');
    this.saveBtn.innerHTML = '复制到剪贴板';
    this.saveBtn.id = AnnotationBoardId.BUTTON;
    AnnotationBoardStyle.saveButtonStyle(this.saveBtn.style);
    this.isShowing = false;
  }
  getPosition() {
    const focusNode = document.getSelection().focusNode;
    if (!focusNode) throw new Error('no selection, should not create node');
    const focusParentElement = focusNode.parentElement;
    return new Position(focusParentElement.getBoundingClientRect());
  }
  updateContainer() {
    try {
      const pos = this.getPosition();
      this.container.style.left = pos.left();
      this.container.style.top = pos.top();
    } catch (err) {
      console.error(err);
    }
  }
  updateSaveButton() {
    this.saveBtn.addEventListener('click', (event) => {
      Selection.copyToClipboard(this.textarea);
      createSnippet(this.textarea.value);
      this.hide();
    })
  }
  updateTextarea(selection) {
    this.textarea.value = selection.content(this.textarea.value);
  }
  show() {
    this.updateTextarea(new Selection());
    this.updateContainer();
    if (!this.isShowed) {
      this.container.appendChild(this.textarea);
      this.updateSaveButton();
      this.container.appendChild(this.saveBtn);
    }
    document.body.appendChild(this.container);
    this.isShowing = true;
    this.isShowed = true;
  }
  shouldShow() {
    return !this.isShowing && !(new Selection()).isEmpty();
  }
  hide() {
    this.isShowing = false;
    document.body.removeChild(this.container)
  }
  shouldHide(event) {
    const target = event && event.target;
    if (!target && this.iShowing) {
      return true;
    } else {
      const inContainer = event.target.id === AnnotationBoardId.CONTAINER;
      const inTextarea = event.target.id === AnnotationBoardId.TEXTAREA;
      const inButton = event.target.id === AnnotationBoardId.BUTTON;
      return !inContainer && !inTextarea && !inButton && this.isShowing;
    }
  }
  destory() {
    this.container.removeChild(this.saveBtn);
    this.saveBtn = null;
    this.container.removeChild(this.textarea);
    this.textarea = null;
    document.body.removeChild(this.container);
    this.container = null;
  }
}

class AnnotationBoard {
  constructor() {
    this.annotationTextArea = new AnnotationTextArea();
  }
  run() {
    this.eventBinding();
  }
  eventBinding() {
    window.addEventListener('mouseup', (event) => {
      this.handleMouseUp(event);
    }, false);
  }
  handleMouseUp(event) {
    if (this.annotationTextArea.shouldShow()) {
      this.annotationTextArea.show();
    } else if (this.annotationTextArea.shouldHide(event)) {
      this.annotationTextArea.hide();
    }
  }
}
const annotationBoard = new AnnotationBoard();
annotationBoard.run();
