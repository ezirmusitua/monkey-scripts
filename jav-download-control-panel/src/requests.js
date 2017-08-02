// Search result from tokyotosho
const {Request, Header} = window.JMUL;
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
        request.setUrl(this.host + `/search.php?terms=${target}`,``);
        return request.send();
    }
}
TokyoToSho.instance = undefined;

class Panel {
    constructor() {
        if (!Panel.instance) {
            this.options = _options;
            this.initHeaders();
            this.host = 'https://www.tokyotosho.info';
            Panel.instance = this;
        }
        return Panel.instance;
    }
}
Panel.instance = undefined;

module.exports = {
    TokyoToSho, Panel
};

