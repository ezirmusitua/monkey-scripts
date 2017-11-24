const { Element } = window.JMUL || { Element: {} };

class ToRemove {
    constructor (toRemoveSelectors) {
        this.toRemoveSelectors = toRemoveSelectors;
    }

    startRemove () {
        this.toRemoveSelectors.forEach(s => {
            const elems = document.querySelectorAll(s);
            if (elems && elems.length) {
                elems.forEach(e => e.remove());
            }
        });
    }
}

class ToUpdate {
    constructor (toUpdateElements) {
        this.toUpdateElements = toUpdateElements;
    }

    startUpdate () {
        this.toUpdateElements.forEach(e => {
            const elem = document.querySelector(e.selector);
            if (elem) {
                const jElem = new Element(elem);
                jElem.setCss(e.styles);
            }
        });
    }
}

module.exports = { ToRemove, ToUpdate };