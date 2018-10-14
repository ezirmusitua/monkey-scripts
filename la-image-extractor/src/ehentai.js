const {href, innerText, createLoadingElement} = require('./utils');

const [
  MainContainerSelector,
  TopPaginationSelector,
  ImageContainerSelector,
  BottomPaginationSelector,
  ImagesSelector,
  TitleSelector
] = ['#i1', '#i2', '#i3', '#i4', '#i3 img', 'title'];
const NextPagePattern = /<div id="i3"><a onclick="return load_image\((\d+), '([\w\d]+)'\)"/gi;
const ImageSourcePattern = /<img id="img" src="(.*)" style=".*?" onerror=".*?" \/>/gi;

function constructImage(src) {
  const img = document.createElement('img');
  img.style.height = '1600px';
  img.style.width = '1150px';
  img.style.maxWidth = '1280px';
  img.style.maxHeight = '1920px';
  img.setAttribute('src', src);
  return img;
}

module.exports = {
  fetchEhentaiAll() {
    const postId = href().split('/')[5].split('-')[0];
    let prevPage = 1;

    const loadingElement = createLoadingElement();

    function getNextImage(page, hash) {
      const url = `https://e-hentai.org/s/${hash}/${postId}-${page}`;
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.open('GET', url);
      xmlhttp.onreadystatechange = function () {
        if (this.readyState !== 4) return;
        if (this.status === 200) {
          const [, imageSource] = ImageSourcePattern.exec(this.responseText);
          const img = constructImage(imageSource);
          document.querySelector(ImageContainerSelector).appendChild(img);
          ImageSourcePattern.lastIndex = -1;
          const [, p, h] = NextPagePattern.exec(this.responseText);
          NextPagePattern.lastIndex = -1;
          if (parseInt(p, 10) <= prevPage + 1) {
            document.body.removeChild(loadingElement);
            return;
          }
          getNextImage(p, h);
        }
        prevPage += 1;
      };
      xmlhttp.send();
    }

    document.querySelector(TopPaginationSelector).style.display = 'none';
    document.querySelector(BottomPaginationSelector).style.display = 'none';
    document.body.appendChild(loadingElement);
    const [, page, hash] = NextPagePattern.exec(document.querySelector(MainContainerSelector).innerHTML);
    getNextImage(page, hash);
  },
  extractEhentaiImages() {
    const imgs = document.querySelectorAll(ImagesSelector);
    const sources = Array.from(imgs).map(i => i.src);
    const title = innerText(document.querySelector(TitleSelector));
    return `${title}\n${sources.join('\n')}\n${'= ='.repeat(20)}`;
  }
};
