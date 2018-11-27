const {href, innerText, isHitomi} = require('./utils');

let _HitomiState = {};

module.exports = {
  initHitomi() {
    if (!isHitomi()) return;
    _HitomiState.ImgsSrcSelector = '.image-url';
    _HitomiState.TitleSelector = 'title';
    _HitomiState.Adapost = false;
    _HitomiState.NumberOfFrontEnds = 2;

  },
  extractHitomiImages() {
    const {ImgsSrcSelector, TitleSelector, Adapost, NumberOfFrontEnds} = _HitomiState;
    let images = Array.from(document.querySelectorAll(ImgsSrcSelector));
    let title = encodeURIComponent(innerText(document.querySelector(TitleSelector), '- | -').split(' | ')[0]);
    const mat = /\/\d*(\d)\.html/.exec(href());
    let lv = mat && parseInt(mat[1], 10);
    if (!lv || Number.isNaN(lv)) {
      lv = '1';
    }
    const magic = Adapost ? 'a' : String.fromCharCode(((lv === 1 ? 0 : lv) % NumberOfFrontends) + 97);
    images = images.map(s => s.innerText.replace('//g.hitomi.la', `https://${magic}a.hitomi.la`));
    return `${title}\n${images.join('\n')}\n${'= ='.repeat(20)}`;
  }
};
