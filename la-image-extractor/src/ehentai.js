const {href, innerText, createFullScreenElement} = require('./utils');

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
const IMAGE_ELEMENT_CREATION_DEFER = 200;
let FETCH_ALL_RUNNING = false;

function constructImage(src) {
  const img = document.createElement('img');
  img.style.width = '100vw';
  img.style.maxWidth = '100vw';
  img.setAttribute('src', src);
  return img;
}

function loadMore() {
  ImageContainer.removeChild(LoadMoreBtn);
  const targets = image_sources.slice(image_appended_count, image_appended_count + IMAGE_PER_PAGE);
  let i = 0;
  for (const src of targets) {
    let timer = setTimeout(() => {
      const img = constructImage(src);
      document.querySelector(ImageContainerSelector).appendChild(img);
      clearTimeout(timer);
      timer = null;
    }, i * IMAGE_ELEMENT_CREATION_DEFER);
    image_appended_count += 1;
    i += 1;
  }
  if (image_appended_count < image_sources.length) {
    ImageContainer.appendChild(LoadMoreBtn);
  }
}

const IMAGE_PER_PAGE = 20;
let image_appended_count = 1;
let image_sources = ['first_image_placeholder'];
const postId = href().split('/')[5].split('-')[0];


const ImageContainer = document.querySelector(ImageContainerSelector);
const LoadMoreBtn = document.createElement('div');
LoadMoreBtn.style.width = '100%';
LoadMoreBtn.style.lineHeight = '48px';
LoadMoreBtn.style.margin = '24px 60px';
LoadMoreBtn.style.cursor = 'pointer';
LoadMoreBtn.style.backgroundColor = 'lightskyblue';
LoadMoreBtn.style.borderRadius = '8px';
LoadMoreBtn.innerText = 'LOAD MORE';
LoadMoreBtn.addEventListener('click', loadMore);

module.exports = {
  fetchEhentaiAll() {
    if (FETCH_ALL_RUNNING) return;
    FETCH_ALL_RUNNING = true;

    function getNextImage(page, hash) {
      const url = `https://e-hentai.org/s/${hash}/${postId}-${page}`;
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.open('GET', url);
      xmlhttp.onreadystatechange = function () {
        if (this.readyState !== 4) return;
        if (this.status === 200) {
          const [, p, h] = NextPagePattern.exec(this.responseText);
          NextPagePattern.lastIndex = -1;
          const hasNext = parseInt(p, 10) !== image_sources.length;
          if (!hasNext) {
            const loadedElem = createFullScreenElement('ALL IMAGE SOURCES LOADED');
            document.body.appendChild(loadedElem);
            let timer = setTimeout(() => {
              document.body.removeChild(loadedElem);
              clearTimeout(timer);
              timer = null;
            }, 300000);
            FETCH_ALL_RUNNING = false;
            return;
          }
          const [, imageSource] = ImageSourcePattern.exec(this.responseText);
          ImageSourcePattern.lastIndex = -1;
          image_sources.push(imageSource);
          if (image_appended_count < IMAGE_PER_PAGE) {
            // load IMAGE PER PAGE COUNT image at first
            const img = constructImage(imageSource);
            ImageContainer.appendChild(img);
            image_appended_count += 1;
          } else {
            ImageContainer.appendChild(LoadMoreBtn);
          }
          getNextImage(p, h);
        }
      };
      xmlhttp.send();
    }

    const mainContainer = document.querySelector(MainContainerSelector);
    window.addEventListener('resize', () => {document.querySelector(MainContainerSelector).style.maxWidth = '100vw';});
    mainContainer.style.width = '100vw';
    mainContainer.style.maxWidth = '100vw';
    document.querySelector(TopPaginationSelector).style.display = 'none';
    document.querySelector(BottomPaginationSelector).style.display = 'none';
    const [, page, hash] = NextPagePattern.exec(document.querySelector(MainContainerSelector).innerHTML);
    getNextImage(page, hash);
  },
  extractEhentaiImages() {
    const imgs = document.querySelectorAll(ImagesSelector);
    const sources = Array.from(imgs).map(i => i.src);
    const title = innerText(document.querySelector(TitleSelector));
    return `${title}\n${sources.join('\n')}\n${'= ='.repeat(20)}`;
  }
}
;
