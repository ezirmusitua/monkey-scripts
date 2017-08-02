const {Utils} = require('./utils');
const {TaskPanel} = require('./requests');
const {Panel, ProgressBar} = require('./elements');
const {Task} = require('./task');

(function () {
    const tasks = Utils.generateTasks();
    init();
    function init() {
        new TaskPanel().list(Task.joinName(tasks)).then(function (res) {
            const serverTaskNameMap = JSON.parse(res);
            tasks.forEach((task) => {
                task.setServerStatus(serverTaskNameMap[task.name]);
                const statusBar = new Panel(task);
                statusBar.appendTo(task.panelParent);
                const progressBar = new ProgressBar(task);
                progressBar.appendTo(task.progressBarParent);
            })
        });
    }
}());

