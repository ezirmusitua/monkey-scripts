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
                // FIXME: Fix JMRequest then change here
                const magnets = (new Utils.TokyoToShoParser(response.responseText)).matchAll();
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