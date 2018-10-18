const {isHitomi, isNozomi, isEhentai, copyToClipboard} = require('./utils');
const Button = require('./Button');
const {extractHitomiImages} = require('./hitomi');
const {extractNozomiImages, fetchNozomiAll} = require('./nozomi');
const {extractEhentaiImages, fetchEhentaiAll} = require('./ehentai');

(function () {
  // create button to click
  if (isNozomi() || isEhentai()) {
    const btn = new Button('Fetch All');
    btn.addCss({bottom: '160px', zIndex: '999'});
    btn.appendTo(document.body);
    btn.onClick(() => {
      if (isNozomi()) {
        fetchNozomiAll();
      }
      if (isEhentai()) {
        fetchEhentaiAll();
      }
    });
  }
  const btn = new Button('Copy Sources');
  btn.addCss({zIndex: '999'});
  btn.onClick(() => {
    // prepare str2Paste
    let str2paste = '';
    if (isHitomi()) {
      str2paste = extractHitomiImages();
    } else if (isNozomi()) {
      str2paste = extractNozomiImages();
    } else {
      str2paste = extractEhentaiImages();
    }
    copyToClipboard(str2paste);
  });
  btn.appendTo(document.body);
})();
