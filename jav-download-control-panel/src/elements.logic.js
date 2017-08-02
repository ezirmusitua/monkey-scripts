const {TokyoToSho, Panel} = require('./requests');

class UnknownClickAction {
    constructor(task) {
        this.fn = (event) => {
            event.preventDefault();
            new TokyoToSho().search(task.name).then((response) => {
                const magnets = (new TokyoToShoMatcher(response)).matchAll();
                if (magnets && magnets.length) {
                    const best = (new SearchResultFilter(magnets)).best();
                    LocalRequest.startTask({name: task.name, uri: best.link});
                } else {
                    alert('无可用资源');
                }
            });
        }
    }
}

class ActiveClickAction {
    constructor() {
        this.fn = (event) => {
            event.preventDefault();
            console.log('resume');
        }
    }
}

class WaitingClickAction {
    constructor() {
        this.fn = (event) => {
            event.preventDefault();
            console.log('waiting');
        }
    }
}

class PausedClickAction {
    constructor() {
        this.fn = (event) => {
            event.preventDefault();
            console.log('paused');
        };
    }
}

class RemovedClickAction {
    constructor() {
        this.fn = (event) => {
            event.preventDefault();
            console.log('error');
        };
    }
}

class ErrorClickAction {
    constructor() {
        this.fn = (event) => {
            event.preventDefault();
            console.log('error');
        };
    }
}

class CompletedClickAction {
    constructor() {
        this.fn = (event) => {
            event.preventDefault();
            console.log('error');
        };
    }
}

class ClickActionFactory {
    constructor() {}

    static create(type) {
        if (!ClickActionFactory.caches[type]) {
            switch (type) {
                case 'active':
                    ClickActionFactory.caches[type] = new ActiveClickAction();
                    break;
                case 'waiting':
                    ClickActionFactory.caches[type] = new WaitingClickAction();
                    break;
                case 'Paused':
                    ClickActionFactory.caches[type] = new PausedClickAction();
                    break;
                case 'Removed':
                    ClickActionFactory.caches[type] = new RemovedClickAction();
                    break;
                case 'Completed':
                    ClickActionFactory.caches[type] = CompletedClickAction();
                    break;
                case 'Error':
                    ClickActionFactory.caches[type] = new ErrorClickAction();
                    break;
                case 'unknown':
                default:
                    ClickActionFactory.caches[type] = new UnknownClickAction();
            }
        }
        return ClickActionFactory.caches[type];
    }
}

ClickActionFactory.caches = {};