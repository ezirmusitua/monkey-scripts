const { ToRemove, ToUpdate } = require('./Operator');

class Site {
    constructor (siteSetting) {
        this.workingTimeout = null;
        this.match = (url) => siteSetting.url.test(url);
        this.toRemove = new ToRemove(siteSetting.toRemove);
        this.toUpdate = new ToUpdate(siteSetting.toUpdate);
    }


    start (url) {
        if (!this.match(url)) return;
        if (this.workingTimeout) {
            clearTimeout(this.workingTimeout);
            this.workingTimeout = null;
        }
        return new Promise((res) => {
            this.workingTimeout = setTimeout(() => {
                this.toRemove.startRemove();
                this.toUpdate.startUpdate();
                res('done')
            }, 100);
        });
    }
}

const Jobbole = {
    url: /http:\/\/blog\.jobbole\.com\/\d+\//,
    toRemove: [
        '#top-nav',
        'header',
        '.copyright-area',
        '#breadcrumb',
        '#main-nav',
        '#sidebar',
        '.entry-meta',
        '#full-btm',
        '#full-top',
        '.post-adds',
        '#author-bio',
        '#cboxOverlay',
        '#colorBox',
        '#article-comment',
        '#comment_list',
        '.clear',
        'footer',
        '#bottom',
        '.textwidget',
    ],
    toUpdate: [ {
        selector: '#wrapper',
        styles: {
            padding: 0,
            background: 'transparent',
        },
    }, {
        selector: 'body',
        styles: {
            background: '#E3EDCD',
            'padding-top': '80px',
        },
    }, {
        selector: '.grid-8',
        styles: {
            'width': '100%',
        },
    } ],
};

const Cartoonmad = {
    url: /http:\/\/www\.cartoonmad\.com\/comic\/.*\.html/,
    toRemove: [
        'table > tbody > tr:nth-child(1)',
        'table > tbody > tr:nth-child(2)',
        'table > tbody > tr:nth-child(3)',
        'table > tbody > tr:nth-child(4)',
        'table > tbody > tr:nth-child(7)',
        'table > tbody > tr:nth-child(5) > td:nth-child(2)',
        'table > tbody > tr:nth-child(5) > td:nth-child(3)',
    ],
    toUpdate: [],
};

module.exports = {
    Sites: [ new Site(Jobbole), new Site(Cartoonmad) ],
};