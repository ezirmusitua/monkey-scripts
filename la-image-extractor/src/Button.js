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
