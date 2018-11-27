const {createFullScreenElement, href, innerText, isEhentai} = require('./utils');

let _EhentaiState = {};

function constructImage(src) {
  const img = document.createElement('img');
  img.style.width = '100vw';
  img.style.maxWidth = '100vw';
  img.setAttribute('src', src);
  return img;
}

function loadMore() {
  _EnthtaiState.ImageContainer.removeChild(_EhentaiState.LoadMoreBtn);
  const targets = _EhentaiState.ImageSources
  .slice(_EhentaiState.ImageAppendedCount, _EhentaiState.ImageAppendedCount + IMAGE_PER_PAGE);
  let i = 0;
  for (const src of targets) {
    let timer = setTimeout(() => {
      const img = constructImage(src);
      document.querySelector(_EhentaiState.ImageContainerSelector).appendChild(img);
      clearTimeout(timer);
      timer = null;
    }, i * _EhentaiState.ImageElementCreationDefer);
    _EhentaiState.ImageAppendedCount += 1;
    i += 1;
  }
  if (_EhentaiState.ImageAppendedCount < _EhentaiState.ImageSources.length) {
    _EhentaiState.ImageContainer.appendChild(_EhentaiState.LoadMoreBtn);
  }
}




module.exports = {
  initEhentai() {
    if (!isEhentai()) return;
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
    const ImageElementCreationDefer = 200;
    const ImagePerPage = 20;
    const PostId = href().split('/')[5].split('-')[0];
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

    let FetchAllRunning = false;
    let ImageAppendedCount = 1;
    let ImageSources = ['first_image_placeholder'];

    _EhentaiState = {
      MainContainerSelector,
      TopPaginationSelector,
      ImageContainerSelector,
      BottomPaginationSelector,
      ImagesSelector,
      TitleSelector,
      NextPagePattern,
      ImageSourcePattern,
      ImageElementCreationDefer,
      ImagePerPage,
      PostId,
      ImageContainer,
      LoadMoreBtn,
      ImageAppendedCount,
      ImageSources,
      FetchAllRunning,
    }
  },
  fetchEhentaiAll() {
    if (_EhentaiState.FetchAllRunning) return;
    _EhentaiState.FetchAllRunning = true;

    function getNextImage(page, hash) {
      const url = `https://e-hentai.org/s/${hash}/${_EhentaiState.PostId}-${page}`;
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.open('GET', url);
      xmlhttp.onreadystatechange = function () {
        if (this.readyState !== 4) return;
        if (this.status === 200) {
          const [, p, h] = _EnthtaiState.NextPagePattern.exec(this.responseText);
          _EhentaiState.NextPagePattern.lastIndex = -1;
          const hasNext = parseInt(p, 10) !== _EhentaiState.ImageSources.length;
          if (!hasNext) {
            const loadedElem = createFullScreenElement('ALL IMAGE SOURCES LOADED');
            document.body.appendChild(loadedElem);
            let timer = setTimeout(() => {
              document.body.removeChild(loadedElem);
              clearTimeout(timer);
              timer = null;
            }, 3000);
            _EhentaiState.FetchAllRunning = false;
            return;
          }
          const [, imageSource] = _EhentaiState.ImageSourcePattern.exec(this.responseText);
          _EhentaiState.ImageSourcePattern.lastIndex = -1;
          _EhentaiState.ImageSources.push(imageSource);
          if (_EhentaiState.ImageAppendedCount < _EhentaiState.ImagePerPage) {
            // load IMAGE PER PAGE COUNT image at first
            const img = constructImage(imageSource);
            _EhentaiState.ImageContainer.appendChild(img);
            image_appended_count += 1;
          } else {
            ImageContainer.appendChild(_EhentaiState.LoadMoreBtn);
          }
          getNextImage(p, h);
        }
      };
      xmlhttp.send();
    }

    const mainContainer = document.querySelector(_EhentaiState.MainContainerSelector);
    window.addEventListener('resize', () => {
      document.querySelector(_EhentaiState.MainContainerSelector).style.maxWidth = '100vw';
    });
    mainContainer.style.width = '100vw';
    mainContainer.style.maxWidth = '100vw';
    document.querySelector(_EhentaiState.TopPaginationSelector).style.display = 'none';
    document.querySelector(_EhentaiState.BottomPaginationSelector).style.display = 'none';
    const [, page, hash] = _EhentaiState.NextPagePattern.exec(
      document.querySelector(_EhentaiState.MainContainerSelector).innerHTML
    );
    getNextImage(page, hash);
  },
  
  extractEhentaiImages() {
    const img = document.querySelector(_EhentaiState.ImagesSelector);
    const title = innerText(document.querySelector(_EhentaiState.TitleSelector));
    return `${title}\n${[img.src, ..._EhentaiState.ImageSources.slice(1)].join('\n')}\n${'= ='.repeat(20)}`;
  }
};
