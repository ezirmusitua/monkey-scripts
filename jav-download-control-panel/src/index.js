const {Utils} = require('./utils');
const {TaskPanel} = require('./requests');
const {Panel, ProgressBar} = require('./elements');
const {Task} = require('./task');

(function () {
    const href = window.location.href;
    // const href = 'http://www.javlibrary.com/cn/?v=123;';
    const tasks = Utils.generateTasks(href);
    init(tasks);
    function init(tasks) {
        const taskRequest = new TaskPanel();
        taskRequest.list(Task.joinName(tasks)).then(function (res) {
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

