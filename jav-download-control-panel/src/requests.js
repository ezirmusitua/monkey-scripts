// Search result from tokyotosho
const {Request, Header} = window.JMUL || {Request: {}, Header: {}};

class TokyoToSho {
    constructor(_options = {}) {
        if (!TokyoToSho.instance) {
            this.options = _options;
            this.initHeaders();
            this.host = 'https://www.tokyotosho.info';
            TokyoToSho.instance = this;
        }
        return TokyoToSho.instance;
    }

    initHeaders() {
        this.options.headers = new Header({
            ':authority': 'www.tokyotosho.info',
            ':scheme': 'https',
            'accept': 'text / html, application/xhtml+xml,application/xml;q=0.9, image/webp,*/*;q=0.8',
            'accept-encoding;': 'gzip, deflate, sdch, br',
            'accept-language': 'zh-CN, en-US;q=0.8, en;q=0.6, zh;q=0.4',
            'cache-control': 'no-cache',
        });
    }

    search(target) {
        const request = new Request(this.options);
        request.setMethod('GET');
        request.setUrl(this.host + `/search.php?terms=${target}`, ``);
        return request.send();
    }
}

TokyoToSho.instance = undefined;

class TaskPanel {
    constructor(_options = {}) {
        if (!TaskPanel.instance) {
            this.options = _options;
            this.initHeaders();
            this.host = 'http://localhost:5000/downloader/api/v0.1.0/task';
            TaskPanel.instance = this;
        }
        return TaskPanel.instance;
    }

    initHeaders() {
        this.options.headers = new Header({'Content-Type': 'application/json'});
    }

    start(task) {
        const request = new Request(this.options);
        request.setMethod('POST');
        request.setUrl(this.host);
        request.setData(task.json());
        return request.send();
    }

    list(taskStr) {
        const request = new Request(this.options);
        request.setMethod('GET');
        request.setUrl(`${this.host}?names=${taskStr}`);
        return request.send();
    }
}

TaskPanel.instance = undefined;

module.exports = { TokyoToSho, TaskPanel};
