// Status and progress bar
const JMElement = window.JMUL.Element || {};
const {ClickActionFactory} = require('./elements.logic');

class PanelButton {
    constructor(type, label) {
        this.type = type;
        this.btn = new JMElement('button');
        this.btn.setInnerText(label);
        this.initStyle();
        this.bindClick();
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

    bindClick() {
        const fn = ClickActionFactory.create(this.type);
        this.btn.listen('click', )
    }

    updateCss(styles) {
        this.btn.setCss(styles);
    }
}

class PanelButtonFactory {
    constructor() {
        if (!PanelButton.instance) {
            PanelButton.instance = this;
        }
        return PanelButton.instance;
    }

    create(type) {
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

class DownloadOperationBtn {
    constructor(status) {
        this.btn = document.createElement('div');
        DownloadOperationBtnStyle[status](this.btn.style);
        this.btn.textContent = DownloadOperationBtnText[status];
    }

    bind(action, fn) {
        this.btn.addEventListener(action, fn);
        return this;
    }

    appendTo(parent) {
        parent.appendChild(this.btn);
    }
}

class TaskProgressBar {
    constructor(task) {
        const percentage = (task.completedLength / task.totalLength) * 100;
        this.progressBar = document.createElement('div');
        this.progressBar.style.position = 'absolute';
        this.progressBar.style.top = this.progressBar.style.left = '0';
        this.progressBar.style.width = '100%';
        this.progressBar.style.height = '4px';
        this.progressBar.style.backgroundColor = 'grey';
        const alreadyProgress = document.createElement('div');
        alreadyProgress.style.width = percentage + '%';
        alreadyProgress.style.height = 'inherit';
        alreadyProgress.style.backgroundColor = 'green';
        this.progressBar.appendChild(alreadyProgress);
    }

    appendTo(parent) {
        parent.appendChild(this.progressBar);
    }
}

class TaskStatusBar {
    constructor(task) {
        this.statusBar = document.createElement('section');
        this.statusBar.style.display = 'flex';
        this.statusBar.style.margin = '-4px 0';
        for (const cand of TaskStatusBtnCandidates[task.status]) {
            const btn = new DownloadOperationBtn(cand);
            btn.bind('click', TaskOperation[cand](task)).appendTo(this.statusBar);
        }
    }

    appendTo(parent) {
        parent.style.display = 'flex';
        parent.style.margin = '4px 15%';
        parent.appendChild(this.statusBar);
    }
}