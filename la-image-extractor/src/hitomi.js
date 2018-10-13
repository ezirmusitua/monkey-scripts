const ImgSrcSelector = '.img-url';
const TitleSelector = 'title';
const ADAPOST = false;
const NUMBER_OF_FRONTENDS = 2;

module.exports = function extractImages() {
  let images = Array.from(document.querySelectorAll(ImgSrcSelector));
  const titleElem = document.querySelector(TitleSelector) || {innerText: 'Unknown | Unkonow'};
  let title = encodeURIComponent(titleElem.innerText.split(' | ')[0]);
  const mat = /\/\d*(\d)\.html/.exec(window.location.href);
  let lv = mat && parseInt(mat[1], 10);
  if (!lv || Number.isNaN(lv)) {
    lv = '1';
  }
  const magic = ADAPOST ? 'a' : String.fromCharCode(((lv === 1 ? 0 : lv) % NUMBER_OF_FRONTENDS) + 97);
  images = images.map(s => s.innerText.replace('//g.hitomi.la', `https://${magic}a.hitomi.la`));
  return `${title}\n${images.join('\n')}\n${'= ='.repeat(20)}`;
};
