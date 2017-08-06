let JMUL = window.JMUL || {};

const Map = (list, fn) => {
  let result = [];
  if (list && list.length) {
    for (let i = 0; i < list.length; i += 1) {
      result.push(fn(list[ i ]));
    }
  }
  return result;
};

class TextElement {
  constructor (element) {
    this.element = new JMUL.Element(element);
    this.innerText = this.element.innerText;
    this.shouldHighlight = false;
  }

  detect () {
    for (const keyword of TextElement.keywords) {
      const keywordPattern = new RegExp(keyword, 'gi');
      if (keywordPattern.test(this.innerText)) {
        this.shouldHighlight = true;
        break;
      }
    }
    return this;
  }

  highlight () {
    if (this.shouldHighlight) {
      this.element.setCss(TextElement.highlightStyle);
    }
  }

  static init (setting) {
    TextElement.highlightStyle = {
      background: setting.highlightBgColor,
      color: setting.highlightTxtColor,
    };
  }

  static setKeywords (keywords) {
    TextElement.keywords = keywords;
  }

  static findAll () {
    return TextElement.targetTagNames.reduce((res, tagName) => {
      const tags = document.getElementsByTagName(tagName);
      return res.concat(Map(tags, (e) => new TextElement(e)));
    }, []);
  }
}

TextElement.targetTagNames = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'p', 'a', 'pre', 'blockquote', 'summary' ];
module.exports = TextElement;
