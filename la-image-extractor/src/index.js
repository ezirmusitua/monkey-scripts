const {isHitomi, copyToClipboard} = require('./utils');
const Button = require('./Button');
const extractHitomiImages = require('./hitomi');
const extractNozomiImages = require('./nozomi');

(function () {
  // create button to click
  const btn = new Button('Copy Sources');
  btn.onClick(() => {
    // prepare str2Paste
    let str2paste = '';
    if (isHitomi()) {
      str2paste = extractHitomiImages();
    } else {
      str2paste = extractNozomiImages();
    }
    copyToClipboard(str2paste);
  });
  btn.appendTo(document.body);
})();
