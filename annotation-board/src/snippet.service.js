const JMUL = window.JMUL || {};

class SnippetService {
    constructor(host = 'http://127.0.0.1', port = 5000, _options = {}) {
        if (!SnippetService.instance) {
            this.host = host;
            this.port = port;
            this.options = _options;
            if (!this.options.headers) {
                this.options.headers = {'Content-Type': 'application/json'};
            }
            SnippetService.instance = this;
        }
        return SnippetService.instance;
    }

    save(data) {
        const request = new JMUL.Request(this.options);
        request.setMethod('POST');
        request.setUrl(this.host + ':' + this.port.toString() + '/snippet/api/v0.1.0');
        request.setData(data);
        request.send();
    }
}

SnippetService.instance = undefined;

module.exports = new SnippetService();