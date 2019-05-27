(function () {
  function hideGalleryContainTags(galleries, tags = ['guro', 'blood']) {
    galleries.forEach((node) => {
      const galleryTags = Array.from(node.querySelectorAll('.relatedtags > ul > li')).map((e) => e.innerText);
      if (galleryTags.some((gt) => tags.some((t) => (new RegExp(t, 'gi')).test(gt)))) {
        node.style.display = 'none';
      }
    });
  }

  function startCheck() {
    let tryTimes = 0;
    let checkInterval = setInterval(() => {
      const galleries = Array.from(document.querySelectorAll('.gallery-content > div'));
      if (!galleries.length) {
        tryTimes += 1;
      }
      if (tryTimes > 20 || galleries.length) {
        hideGalleryContainTags(galleries);
        clearInterval(checkInterval);
        checkInterval = null;
      }
    }, 500);
  }

  // listen page button click
  window.addEventListener('click', startCheck);
  // window.addEventListener('scroll', startCheck);
  startCheck();
})();