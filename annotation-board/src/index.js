const AnnotationBoard = require('./annotation-board');

(function () {
  const annotationBoard = new AnnotationBoard();
  bindEvent();
  function bindEvent () {
    window.addEventListener('mouseup', (event) => {
      handleMouseUp(event);
    }, false);
  }

  function handleMouseUp (event) {
    if (annotationBoard.shouldShow()) {
      annotationBoard.show();
    } else if (annotationBoard.shouldHide(event)) {
      annotationBoard.hide();
    }
  }
})();
