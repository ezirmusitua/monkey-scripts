const KeywordService = require('./keyword.service');
const SettingService = require('./setting.service');
const TextElement = require('./element');

const Config = {};

(function () {
    let highlightedCount = 0;
    // const href = window.location.href;
    const href = 'https://sspai.com';
    loadSetting().then((setting) => {
        KeywordService.init(setting, href);
        TextElement.init(setting);
        highlight()
    });
    window.addEventListener('scroll', highlight);

    function loadSetting() {
        SettingService.init(Config);
        return SettingService.load();
    }

    function highlight() {
        const elements = TextElement.findAll();
        if (elements.length === highlightedCount) return;
        KeywordService.list().then((keywords) => {
            TextElement.setKeywords(keywords);
            elements.map((e) => e.detect().highlight());
            highlightedCount = elements.length;
        });
    }
})();
