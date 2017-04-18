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

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const date = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `Date: ${year}-${month + 1}-${date}[${hour}:${minute}]`;
}

const AnnotationBoardId = {
  CONTAINER: 'annotation-container',
  TEXTAREA: 'annotation-textarea',
  BUTTON: 'annotation-button'
};

let SelectionInstance = null;

class Selection {
  constructor() {
    this.createAtStr = formatDate(new Date());
    this.selectionText = document.getSelection().toString();
    if (!SelectionInstance) {
      SelectionInstance = this;
    }
    return SelectionInstance;
  }
  concat() {
    return this.createAtStr + '\n' + `Content: ${this.selectionText}`;
  }
  content() {
    if (SelectionInstance) {
      return SelectionInstance.previousContent + '\n' + '========' + '\n' + this.concat();
    } else {
      this.previousContent = this.concat();
    }
    return this.previousContent;
  }
}

class Position {
  constructor(rect, offset) {
    this._left = (rect.left + (offset || 16)) + 'px';
    this._top = (rect.top + (offset || 16)) + 'px';
  }
  top() {
    return this.top;
  }
  left() {
    return this.left;
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
  }
  getPosition() {
    const focusNode = document.getSelection().focusNode();
    if (!focusNode) throw new Error('no selection, should not create node');
    const focusParentElement = focusNode.parentElement;
    return new Position(focusParentElement.getBoundingClientRect());
  }
  addContainerStyle() {
    try {
      const pos = this.getPosition();
      this.container.style.position = 'absolute';
      this.container.style.left = pos.left();
      this.container.style.top = pos.top();
      this.container.style.backgroundColor = 'red';
      this.container.style.padding = '8px';
    } catch (err) {
      // do something
    }
  }
  addTextAreaStyle() {
    // do something
  }
  addSaveButtonStyle() {
    // do something
  }
  updateTextareaContent(selection) {
    this.textarea.setAttribute('value', selection.content());
  }
  show(selection) {
    this.updateTextareaContent(selection);
    this.container.appendChild(this.textarea);
    this.container.appendChild(this.saveBtn);
    document.body.appendChild(this.container);
  }
  destory() {
    this.saveBtn = null;
    this.textarea = null;
    this.container = null;
  }
}

class AnnotationBoard {
  constructor() {
    this.annotationTextArea = null;
  }
  eventBinding() {
    window.addEventListener('mouseup', (event) => {
      console.log('mouse up: ', event)
      // this.handleMouseUp(event);
    }, false);
    window.addEventListener('click', (event) => {
      console.log('click: ', event);
    }, false);
  }
  handleMouseUp(event) {
    if (event.target.id === AnnotationBoardId.BUTTON) return;
    if (this.annotationTextArea) {
      this.annotationTextArea.destory();
    } else {
      this.annotationTextArea = new AnnotationTextArea();
      const selection = new Selection();
      this.annotationTextArea.show(selection);
    }
  }
  handleClick(event) {
    if (event.target.id !== AnnotationBoardId.BUTTON) return;
    console.log('do some thing');
  }
}

{
  new AnnotationBoard();
}
