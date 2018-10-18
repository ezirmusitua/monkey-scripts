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
  img.style.width = '100vw';
  img.style.maxWidth = '100vw';
  img.setAttribute('src', src);
  return img;
}

module.exports = {
  fetchEhentaiAll() {
    const postId = href().split('/')[5].split('-')[0];
    let prevPage = 1;

    const loadingElement = createLoadingElement();
    let imageCreationTimer = null;
    let getNextTimer = null;

    function getNextImage(page, hash) {
      const url = `https://e-hentai.org/s/${hash}/${postId}-${page}`;
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.open('GET', url);
      xmlhttp.onreadystatechange = function () {
        if (this.readyState !== 4) return;
        if (this.status === 200) {
          imageCreationTimer = setTimeout(() => {
            const [, imageSource] = ImageSourcePattern.exec(this.responseText);
            const img = constructImage(imageSource);
            document.querySelector(ImageContainerSelector).appendChild(img);
            ImageSourcePattern.lastIndex = -1;
            clearTimeout(imageCreationTimer);
            imageCreationTimer = null;
          }, 1000);
          getNextTimer = setTimeout(() => {
            const [, p, h] = NextPagePattern.exec(this.responseText);
            NextPagePattern.lastIndex = -1;
            const hasNext = parseInt(p, 10) <= prevPage + 1;
            if (hasNext) {
              getNextImage(p, h);
            } else {
              document.body.removeChild(loadingElement);
            }
            clearTimeout(getNextTimer);
            getNextTimer = null;
          }, 1200);
        }
        prevPage += 1;
      };
      xmlhttp.send();
    }

    const mainContainer = document.querySelector(MainContainerSelector);
    window.addEventListener('resize', () => {document.querySelector(MainContainerSelector).style.maxWidth="100vw";})
    mainContainer.style.width = '100vw';
    mainContainer.style.maxWidth = '100vw';
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
