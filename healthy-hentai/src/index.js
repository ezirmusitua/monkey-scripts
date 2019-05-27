(function () {
  function hideGalleryContainTags(galleries, tags = ['guro', 'blood']) {
    galleries.forEach((node) => {
      const galleryTags = Array.from(node.querySelectorAll('.relatedtags > ul > li')).map((e) => e.innerText);
      if (galleryTags.some((gt) => tags.some((t) => (new RegExp(t, 'gi')).test(gt)))) {
        node.style.display = 'none';
      }
    });
  }

  hideGalleryContainTags(Array.from(document.querySelectorAll('.gallery-content > div')));
})();