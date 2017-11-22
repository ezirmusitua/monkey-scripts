const { Element } = window.JMUL || { Element: {} };

(function () {
    console.log('start working');
    const toRemoveSelectors = [
        '#top-nav',
        'header',
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
    ];
    const toUpdateStyleElements = [ {
        selector: '#wrapper',
        styles: {
            padding: 0,
            color: 'transparent',
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
    } ];
    toRemoveSelectors.forEach(s => {
        const elem = document.querySelector(s);
        if (elem) {
            elem.parentNode.removeChild(elem);
        }
    });
    toUpdateStyleElements.forEach(e => {
        const elem = document.querySelector(e.selector);
        if (elem) {
            const jelem = new Element(elem);
            jelem.setCss(e.styles);
        }
    });
    console.log('end working ...');
})();