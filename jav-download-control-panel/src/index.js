const { Utils } = require('./utils');
const { TaskPanel } = require('./requests');
const { Panel, ProgressBar } = require('./elements');
const { Task } = require('./task');

(function () {
  const href = window.location.href;
  const tasks = Utils.generateTasks(href);
  init(tasks);
  function init (tasks) {
    const taskRequest = new TaskPanel();
    taskRequest.list(Task.joinName(tasks)).then(function (res) {
      // FIXME: Fix JMRequest then change here
      const serverTaskNameMap = JSON.parse(res.responseText);
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
