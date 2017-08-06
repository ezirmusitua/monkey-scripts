const { Element } = window.JMUL || { Element: {} };
const { ClickActionFactory } = require('./elements.logic');

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
  constructor () {}
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
    for (const type of TaskStatusBtnCandidates[task.status]) {
      const button = PanelButtonFactory.create(type);
      button.bindClick(task);
      button.appendTo(this.element);
    }
  }

  appendTo (parent) {
    parent.setCss({
      display: 'flex',
      margin: '4px 15%'
    });
    parent.appendChild(this.element);
  }
}

class ProgressBar {
  constructor (task) {
    const percentage = (task.completedLength / task.totalLength) * 100;
    this.element = new Element('div');
    this.already = new Element('div');
    this.initStyles(percentage);
    this.element.appendChild(this.already);
  }

  initStyles (percentage) {
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

  appendTo (parent) {
    return this.element.appendTo(parent);
  }
}

module.exports = { ProgressBar, Panel };
