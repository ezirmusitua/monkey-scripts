module.exports = {
  isHitomi() {
    return window && window.location && /hitomi/gi.test(window.location.href);
  },
  isNozomi() {
    return window && window.location && /nozomi.la\/tag/gi.test(window.location.href);
  },
  isEhentai() {
    return window && window.location && /e-hentai.org\/s/gi.test(window.location.href);
  },
  copyToClipboard(content) {
    const el = document.createElement('textarea');
    el.value = content;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  },
  href(d = '') {
    return (window && window.location && window.location.href) || d;
  },
  innerText(elem, d = '') {
    return (elem && elem.innerText) || d;
  },
  matchAll(content, pat) {
    let matches = [];
    let match = pat.exec(content);
    while (match) {
      matches.push(match[1]);
      match = pat.exec(content);
    }
    pat.lastIndex = -1;
    return matches;
  },
  createFullScreenElement(text) {
    const elem = document.createElement('div');
    elem.style.position = 'fixed';
    elem.style.top = '0';
    elem.style.right = '0';
    elem.style.bottom = '0';
    elem.style.left = '0';
    elem.style.display = 'flex';
    elem.style.backgroundColor = 'rgba(0, 0, 0, 0.56)';
    elem.style.justifyContent = 'center';
    elem.style.alignItems = 'center';
    elem.style.fontSize = '72px';
    elem.style.zIndex = '999';
    elem.innerText = text;
    return elem;
  }
};
