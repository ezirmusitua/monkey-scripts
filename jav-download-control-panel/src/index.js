const {Utils} = require('./utils');
const {TaskPanel} = require('./request');

(function () {
    const tasks = Utils.generateTasks();
    init();
    function init() {
        TaskPanel.list().then(function (res) {
            const serverTaskNameMap = JSON.parse(res);
            tasks.forEach((task) => {
                task.setServerStatus(serverTaskNameMap[task.name]);
                const statusBar = new TaskStatusBar(task);
                statusBar.appendTo(task.panelParent);
                const progressBar = new TaskProgressBar(task);
                progressBar.appendTo(task.progressBarParent);
            })
        });
    }
}());

