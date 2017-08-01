const KeywordService = require('./keyword.service');
const TextElement = require('./text-element');
const MaxDetectTime = 10000;
const DetectIntervalTime = 2000;

(function () {
    let highlightedCount = 0;
    runHighlight();
    window.addEventListener('scroll', () => {
        runHighlight();
    });
    function runHighlight() {
        const elements = TextElement.findAll();
        if (elements.length === highlightedCount) return;
        KeywordService.list().then((keywords) => {
            TextElement.setKeywords(keywords);
            elements.map((e) => e.detect().highlight());
            highlightedCount = elements.length;
        });
    }
})();
