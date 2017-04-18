// ==UserScript==
// @name                annotation-board
// @name:zh-CN          注释墙
// @description         allow you to add annotation after selected content and copy to clipboard
// @description:zh-CN   选中内容后添加注释并复制到剪贴板
// @version             0.1.7
// @author              jferroal
// @license             GPL-3.0
// @updateURL           https://github.com/ezirmusitua/my-tamper-monkey-scripts/raw/master/highlight-my-interest.user.js
// @grant               none
// @require             https://cdn.bootcss.com/clipboard.js/1.6.1/clipboard.min.js
// @require             https://cdn.bootcss.com/jquery/3.2.1/jquery.slim.min.js
// @include             http://*
// @include             https://*
// @run-at              document-end
// @namespace           https://greasyfork.org/users/34556
// ==/UserScript==

// Features
// 1. 选中后弹出输入框添加注释
// 2. 添加的注释中需要有事件信息
// 3. 窗口关闭后/不活跃后将内容复制到剪贴板
// 4. 剪贴板中的内容需要有文章信息

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

const copyToClipboard = (button, textarea) => {
  document.getSelection().removeAllRanges();
  const range = document.createRange();
  range.selectNode(textarea);
  document.getSelection().addRange(range);
  try {
    document.execCommand('copy');
  } catch (err) {
    console.log('Oops, unable to copy');
  }
  window.getSelection().removeAllRanges();
}


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
  static copyToClipboard(button, textarea) {
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
    this.textarea = document.createElement('textarea');
    this.textarea.id = AnnotationBoardId.TEXTAREA;
    this.saveBtn = document.createElement('button');
    this.saveBtn.id = AnnotationBoardId.BUTTON;
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
      this.container.style.position = 'absolute';
      this.container.style.left = pos.left();
      this.container.style.top = pos.top();
      this.container.style.backgroundColor = 'red';
      this.container.style.padding = '8px';
    } catch (err) {
      console.error(err);
    }
  }
  updateSaveButton() {
    this.saveBtn.innerHTML = 'Save!'
    this.saveBtn.addEventListener('click', (event) => {
      Selection.copyToClipboard(this.saveBtn, this.textarea);
      this.hide();
    })
  }
  updateTextarea(selection) {
    this.textarea.value = selection.content(this.textarea.value);
    this.textarea.style.width = '240px';
    this.textarea.style.height = '128px';
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
window.onload = (event) => {
  const board = new AnnotationBoard();
};
