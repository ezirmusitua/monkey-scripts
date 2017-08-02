const {Task} = require('./task');

const PageType = {
    SINGLE_VIEW: 100,
    VIDEO_LIST: 200,
    HOMEPAGE: 300,
};

class Utils {
    static pageType() {
        const currentHref = window.location.href;
        if (/http:\/\/www\.javlibrary\.com\/cn\/\?v=.*/.test(currentHref)) {
            return PageType.SINGLE_VIEW;
        }
        if (/http:\/\/www\.javlibrary\.com\/cn\/vl_.*/.test(currentHref)) {
            return PageType.VIDEO_LIST;
        }
        return PageType.HOMEPAGE;
    }

    static getTaskElements(_type) {
        const type = _type || Utils.pageType();
        switch (type) {
            case PageType.SINGLE_VIEW:
                return [document.getElementById('video_id')];
            case PageType.VIDEO_LIST:
                return document.getElementsByClassName('video') || [];
            case PageType.HOMEPAGE:
            default:
                return document.getElementsByClassName('post-headline') || [];
        }
    }

    static generateTasks(_type) {
        const type = _type || Utils.pageType();
        const elements = Utils.getTaskElements(type);
        return elements.reduce((res, e) => {
            switch (type) {
                case PageType.SINGLE_VIEW:
                    res.push(Task.fromSingleElem(e));
                    break;
                case PageType.VIDEO_LIST:
                    res.push(Task.fromListElem(e));
                    break;
                case PageType.HOMEPAGE:
                default:
                    res.push(Task.fromHomeElem(e));
                    break;
            }
            return res;
        }, []);
    }
}

Utils.PageType = PageType;
Utils.TokyoToShoParser = class TokyoToShoParser {
    constructor(pageContent) {
        this.pageContent = pageContent;
        this.magnetLinkPattern = /<a href="(magnet:\?xt=urn:btih:.*?)">/gi;
        this.seederCountPattern = /S: <span style="color: .*?">(\d+)<\/span>/gi;
        this.leederCountPattern = /L: <span style="color: .*?">(\d+)<\/span>/gi;
        this.completedCountPattern = /C: <span style="color: .*?">(\d+)<\/span>/gi;
        this.sizePattern = /\| Size: (.*?) \|/gi;
    }

    matchAll() {
        const result = [];
        let [mlMatch, scMatch, lcMatch, ccMatch, szMatch] = [undefined, undefined, undefined, undefined, undefined];
        do {
            [mlMatch, scMatch, lcMatch, ccMatch, szMatch] = [
                this.magnetLinkPattern.exec(this.pageContent),
                this.seederCountPattern.exec(this.pageContent),
                this.leederCountPattern.exec(this.pageContent),
                this.completedCountPattern.exec(this.pageContent),
                this.sizePattern.exec(this.pageContent),
            ];
            if (mlMatch) {
                result.push({
                    link: mlMatch[1].trim(),
                    sCount: scMatch[1],
                    lCount: lcMatch[1],
                    cCount: ccMatch[1],
                    size: (szMatch && szMatch[1]) || '0MB',
                });
            }
        } while (mlMatch);
        this.magnetLinkPattern.index = this.seederCountPattern.index = this.leederCountPattern.index = 0;
        this.completedCountPattern.index = this.sizePattern.index = 0;
        return result;
    }
};

module.exports = {Utils};s