class KeywordService {
  static init (setting, href) {
    KeywordService.Setting = setting;
    KeywordService.keywords = [];
    const sites = Object.keys(KeywordService.Setting.sites);
    if (!sites || !sites.length) return;
    sites.forEach((site) => {
      const sitePattern = new RegExp(site, 'gi');
      if (sitePattern.test(href)) {
        KeywordService.keywords.push(...KeywordService.Setting.sites[ site ]);
      }
    });
  }

  static list () {
    return Promise.resolve(KeywordService.keywords);
  }
}

module.exports = KeywordService;
