const JMUL = window.JMUL || {};

const AnnotationBoardId = {
  CONTAINER: 'annotation-container',
  TEXTAREA: 'annotation-textarea',
  BUTTON: 'annotation-button',
};

class BoardContainer {
  constructor () {
    this.element = new JMUL.Element('div');
    this.element.setId(AnnotationBoardId.CONTAINER);
    BoardContainer._initCss(this.element)
  }

  appendChild (children) {
    children.forEach((c) => {
      try {
        this.element.appendChild(c.element)
      } catch (er) {
        console.log(er);
      }
    });
  }

  show () {
    try {
      const pos = JMUL.Element.getSelectedPosition();
      this.element.setCss({
        display: 'flex',
        flexDirection: 'column',
        left: pos.x,
        top: pos.y,
      });
    } catch (err) {
      console.error(err);
    }
  }

  hide () {
    this.element.setCss({
      display: 'none',
    });
  }

  static isContainer (id) {
    return AnnotationBoardId.CONTAINER === id;
  }

  static _initCss (elem) {
    elem.setCss({
      display: 'none',
      fontFamily: 'Noto',
      border: '4px',
      boxShadow: '0px 3px 8px 1px rgba(0, 0, 0, 0.26)',
      position: 'absolute',
      backgroundColor: 'rgba(0, 0, 0, 0.56)',
      padding: '16px 4px 8px 4px',
    });
  }
}

class BoardEdit {
  constructor () {
    this.element = JMUL.Decorator.selectable(new JMUL.Element('textarea'));
    this.element.setId(AnnotationBoardId.TEXTAREA);
    BoardEdit._initCss(this.element);
  }

  appendSelection () {
    const prevVal = this.element.value();
    const selectedText = this.element.getSelection();
    const newVal = (!!prevVal && (prevVal + '\n') || '') + '========' + '\n' + selectedText + '\n';
    this.element.setValue(newVal)
  }

  hide () {
    this.element.setStyle('display', 'none');
  }

  copyToClipboard () {
    this.element.copyToClipboard();
  }

  get value () {
    return this.element.value();
  }

  static isTextarea (id) {
    return AnnotationBoardId.TEXTAREA === id;
  }

  static _initCss (elem) {
    elem.setCss({
      fontFamily: 'Noto',
      width: '240px',
      height: '128px',
      backgroundColor: 'rgba(255, 255, 255, 0.87)',
      marginBottom: '8px',
      borderRadius: '4px',
      color: 'rgba(0, 0, 0, 0.76)',
      fontSize: '12px',
    });
  }
}

class BoardButton {
  constructor () {
    this.element = new JMUL.Element('button');
    this.element.setId(AnnotationBoardId.BUTTON);
    this.element.setInnerHTML('复制到剪贴板');
    BoardButton._initCss(this.element);
  }

  listenClick (fn) {
    this.element.listen('click', (e) => fn());
  }

  static isButton (id) {
    return AnnotationBoardId.BUTTON === id;
  }

  static _initCss (elem) {
    elem.setCss({
      fontFamily: 'Noto',
      border: 'none',
      borderRadius: '4px',
      height: '24px',
      backgroundColor: 'rgba(255, 255, 255, 0.87)',
      color: 'rgba(0, 0, 0, 0.76)',
      fontSize: '14px',
    });
  }
}

module.exports = {
  Container: BoardContainer,
  Textarea: BoardEdit,
  Button: BoardButton,
};
