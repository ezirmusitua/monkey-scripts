// Status and progress bar
class DownloadOperationBtnStyle {
  static basic(elementStyle) {
    elementStyle.width = '22px';
    elementStyle.height = '22px';
    elementStyle.boxSizing = 'border-box';
    elementStyle.marginLeft = '4px';
    elementStyle.cursor = 'pointer';
  }
  static unknown(elementStyle) {
    DownloadOperationBtnStyle.basic(elementStyle);
    elementStyle.color = 'white';
    elementStyle.backgroundColor = 'grey';
    elementStyle.borderRadius = '50%';
    elementStyle.padding
  }
  static active(elementStyle) {
    DownloadOperationBtnStyle.basic(elementStyle);
    // elementStyle.backgroundColor = 'green';
  }
  static waiting(elementStyle) {
    DownloadOperationBtnStyle.basic(elementStyle);
    // elementStyle.backgroundColor = 'green';
  }
  static paused(elementStyle) {
    DownloadOperationBtnStyle.basic(elementStyle);
    // elementStyle.backgroundColor = 'orange';
  }
  static removed(elementStyle) {
    DownloadOperationBtnStyle.basic(elementStyle);
    // elementStyle.backgroundColor = 'red';
  }
  static complete(elementStyle) {
    DownloadOperationBtnStyle.basic(elementStyle);
    // elementStyle.backgroundColor = 'red';
    elementStyle.pointer = 'default';
  }
  static error(elementStyle) {
    DownloadOperationBtnStyle.basic(elementStyle);
    // elementStyle.backgroundColor = 'red';
  }
};

const DownloadOperationBtnText = {
  unknown: '⸮',
  active: '⏩',
  waiting: '•',
  paused: '⏸',
  removed: '⌦',
  complete: '🛆',
  error: '❌',
};

const TaskStatusBtnCandidates = {
  'unknown': ['unknown'],
  'active': ['paused', 'removed'],
  'waiting': ['removed'],
  'paused': ['active', 'removed'],
  'removed': ['active'],
  'complete': ['active', 'complete'],
  'error': ['error'],
};

const TaskOperation = {
  unknown: (task) => {
    return (event) => {
      event.preventDefault();
      TokyoToShoRequest.search(task.name).then((response) => {
        const magnets = (new TokyoToShoMatcher(response)).matchAll();
        if (magnets && magnets.length) {
          const best = (new SearchResultFilter(magnets)).best();
          LocalRequest.startTask({ name: task.name, uri: best.link });
        } else {
          alert('无可用资源');
        }
      });
    }
  },
  active: (task) => {
    return (event) => {
      console.log('resume');
    }
  },
  waiting: (task) => {
    return (event) => {
      event.preventDefault();
      console.log('error');
    }
  },
  paused: (task) => {
    return (event) => {
      event.preventDefault();
      console.log('error');
    }
  },
  removed: (task) => {
    return (event) => {
      event.preventDefault();
      console.log('error');
    }
  },
  error: (task) => {
    return (event) => {
      event.preventDefault();
      console.log('error');
    }
  },
  complete: (task) => {
    return (event) => {
      event.preventDefault();
      console.log('error');
    }
  },
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