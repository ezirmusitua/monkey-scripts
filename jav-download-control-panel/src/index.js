// parse page while page load
class AE86 {
  constructor() { }
  run() {
    this.loadTasks().then((res) => {
      const taskNameMap = JSON.parse(res.responseText);
      this.initTaskStatElem(taskNameMap);
    });
  }
  initTaskStatElem(taskNameMap) {
    for (const name in taskNameMap) {
      if (taskNameMap.hasOwnProperty(name)) {
        const task = taskNameMap[name];
        const relatedElem = this.pageParser.nameElemMap[name];
        const statusBar = new TaskStatusBar(task);
        statusBar.appendTo(relatedElem.statusBarParent);
        const progressBar = new TaskProgressBar(task);
        progressBar.appendTo(relatedElem.progressBarParent);
      }
    }
  }
  loadTasks() {
    this.pageParser = new PageParser();
    return LocalRequest.listTask(this.pageParser.toTasks());
  }
}
const ae86 = new AE86();
ae86.run();
