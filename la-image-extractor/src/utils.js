module.exports = {
  isHitomi() {
    return window && window.location && /hitomi/gi.test(window.location.href);
  },
  isNozomi() {
    return window && window.location && /nozomi.la\/tag/gi.test(window.location.href);
  },
  copyToClipboard(content) {
    const el = document.createElement('textarea');
    el.value = content;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
};
