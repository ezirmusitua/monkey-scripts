class KeywordService {
    static init(setting, href) {
        KeywordService.Setting = setting;
        const sites = Object.keys(KeywordService.Setting.keywords);
        if (sites && sites.length) {
            KeywordService.keywords = sites.reduce((res, site) => {
                const sitePattern = new RegExp(site, 'gi');
                return res.concat(sitePattern.test(href) && KeywordService.Setting.keywords[site] || [])}, []);
        }
    }

    static list() {
        return Promise.resolve(KeywordService.keywords);
    }
}

module.exports = KeywordService;