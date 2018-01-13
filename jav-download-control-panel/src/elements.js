const { Element } = window.JMUL || { Element: {} };
const { ClickActionFactory } = require('./elements.logic');
const DEFAULT_ACTION_TYPE = 'unknown';

class PanelButton {
  constructor (type, label) {
    this.type = type;
    this.btn = new Element('button');
    this.btn.setInnerText(label);
    this.initStyle();
  }
  
  initStyle () {
    this.btn.setCss({
      width: '22px',
      height: '22px',
      boxSizing: 'border-box',
      marginLeft: '4px',
      cursor: 'pointer',
    });
  }
  
  bindClick (task) {
    const gfn = new (ClickActionFactory.create(this.type))(task).cb;
    this.btn.listen('click', (e) => gfn(e, task));
  }
  
  updateCss (styles) {
    this.btn.setCss(styles);
  }
  
  appendTo (parent) {
    return this.btn.appendTo(parent);
  }
}

class PanelButtonFactory {
  constructor () {
  }
  
  static create (type) {
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

class Panel {
  constructor (task) {
    this.element = new Element('section');
    this.initStyles();
    this.initButton(task);
  }
  
  initStyles () {
    this.element.setCss({
      display: 'flex',
      margin: '-4px 0',
    });
  }
  
  initButton (task) {
    const button = PanelButtonFactory.create(DEFAULT_ACTION_TYPE);
    button.bindClick(task);
    button.appendTo(this.element);
  }
  
  appendTo (parent) {
    parent.setCss({
      display: 'flex',
      margin: '4px 15%',
    });
    parent.appendChild(this.element);
  }
}

module.exports = { Panel };
