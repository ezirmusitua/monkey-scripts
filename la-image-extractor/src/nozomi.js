const [ImgSrcSelector, TitleSelector] = ['.tag-list-img', 'h1'];

module.exports = function extractNozomiImages() {
  let images = Array.from(document.querySelectorAll(ImgSrcSelector));
  let title = document.querySelector(TitleSelector).innerText;
  images = images.map(s => s.src.replace('//tn', '//i').split('.').slice(0, 4).join('.'));
  return `${title}\n${images.join('\n')}\n${'= ='.repeat(20)}`;
};
