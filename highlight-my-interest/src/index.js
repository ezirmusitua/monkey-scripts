const KeywordService = require('./keyword.service');
const TextElement = require('./text-element');
const MaxDetectTime = 10000;
const DetectIntervalTime = 2000;

(function () {
    let alreadyLoadedTimes = 0;
    let handledCount = 0;
    const autoMatchInterval = setInterval(() => {
        if (alreadyLoadedTimes < MaxDetectTime) {
            alreadyLoadedTimes += 1;
            const elements = TextElement.findAll();
            if (elements.length === handledCount) return;
            KeywordService.list().then(function (keywords) {
                TextElement.setKeywords(keywords);
                handledCount += elements.length;
                elements.map((e) => e.detect().highlight());
            });
        } else {
            clearInterval(autoMatchInterval);
            console.log('will no match any more');
        }
    }, DetectIntervalTime);
})();
