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
    url: /http:\/\/.*\.jobbole\.com\/.*/,
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
    url: /http:\/\/www\.cartoonmad\.com\/comic\/\d{5,}\.html/,
    // 这里是 traps, 因为 dom 操作是同步的, 当一个 element 被删除之后, 如果使用 nth-child 这样的顺序相关的 selector 的时候, 一定要注意
    toRemove: [
        'body > table > tbody > tr:nth-child(1)',
        'body > table > tbody > tr:nth-child(1)',
        'body > table > tbody > tr:nth-child(1)',
        'body > table > tbody > tr:nth-child(1)',
        'body > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td:nth-child(2)',
        'body > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td:nth-child(2)',
        'body > table > tbody > tr:nth-child(3)',
    ],
    toUpdate: [],
};

const CSDNBlog = {
    url: /http:\/\/blog\.csdn\.net\/.*?\/article\/details\/.*/,
    toRemove: [
        '.switchDOM',
        '.csdn-toolbar',
        '.toolbar-s',
        '#toolbar-tpl-scriptId',
        '.left_fixed',
        '.right_fixed',
        '.pop_win',
        '.pop_mask',
        '.pop_CA_cover',
        '.pop_CA_cover',
        '.pop_CA',
        '.report_dialog',
        'aside',
        '.article_copyright',
        '.article_collect',
        '.comment_box',
        '.comment_li_outbox',
        '.more_comment',
        '.recommend_tit',
        '.recommend_list',
        'ul.right_bar',
    ],
    toUpdate: [ {
        selector: '.container',
        styles: {
            width: '960px',
        },
    } ],
};

const BaiduSearch = {
    url: /https?:\/\/www\.baidu\.com\/s.*/,
    toRemove: [
        '.search_tool_conter > .nums',
        '#content_left > div:not(.result)',
        '#content_right',
        '#rs',
    ],
    toUpdate: [ {
        selector: '#container',
        styles: {
            width: '100%',
            display: 'flex',
            'align-items': 'center',
        },
    }, {
        selector: '#content_left',
        styles: {
            padding: 0,
        },
    }, {
        selector: '#page',
        styles: {
            padding: 0,
        },
    } ],
};

module.exports = {
    Sites: [ new Site(Jobbole), new Site(Cartoonmad), new Site(CSDNBlog), new Site(BaiduSearch) ],
};