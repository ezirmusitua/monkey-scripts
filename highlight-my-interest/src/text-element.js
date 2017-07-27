let JMUL = window.JMUL;
if (!JMUL) {
    JMUL = {};
}

class TextElement {
    constructor(element) {
        this.element = new JMUL.Element(element);
        this.shouldHighlight = false;
    }

    detect() {
        for (const keyword of this.keywords) {
            if (this.element.getAttribute('innerText').indexOf(keyword) < 0) {
                this.shouldHighlight = true;
                break;
            }
        }
        return this;
    }
    highlight() {
        if (this.shouldHighlight) {
            this.element.setCss({
                backgroundColor: '#FFDA5E',
                color: 'black'
            });
        }
    }
    static setKeywords(keywords) {
        TextElement.keywords = keywords;
    }
    static findAll() {
        return TextElement.targetTagNames.reduce((res, tagName) => {
            const tags = document.getElementsByTagName(tagName);
                return res.concat(tags && tags.length && tags.map((e) => new TextElement(e)) || []);
        }, []);
    }
}

TextElement.targetTagNames = ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'a', 'pre', 'blockquote', 'summary'];
module.exports = TextElement;