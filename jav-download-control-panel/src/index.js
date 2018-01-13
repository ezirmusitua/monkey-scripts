const { Utils } = require('./utils');
const { Panel } = require('./elements');

(function () {
  const href = window.location.href;
  if (/http:\/\/www\.javlibrary\.com\/.*\/\?v=.*/.test(href)) {
    const tasks = Utils.generateTasks(href);
    init(tasks);
    
    function init (tasks) {
      tasks.forEach((task) => {
        const statusBar = new Panel(task);
        statusBar.appendTo(task.panelParent);
      });
    }
  }
  
}());
