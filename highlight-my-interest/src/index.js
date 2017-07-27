const KeywordService = require('./keyword.service');
const TextElement = require('./text-element');

(function () {
    let alreadyLoadedTimes = 0;
    const autoMatchInterval = setInterval(() => {
        if (alreadyLoadedTimes < 100) {
            KeywordService.list().then(function (keywords) {
                TextElement.setKeywords(keywords);
                (TextElement.findAll()).map((e) => e.detect().highlight());
            });
        } else {
            clearInterval(autoMatchInterval);
            console.log('will no match any more');
        }
    }, 1000);
})();
