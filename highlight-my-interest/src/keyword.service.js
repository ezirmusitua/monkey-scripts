const DefaultKeywords = [
    "书籍",
    "效率",
    "google.*?",
    "nexus.*?",
    "爬虫",
    "python.*?",
    "angular.*?",
    "node",
    "javascript",
    "ukulele",
    /gtd.*?/gi,
    "工作流",
    "日程",
    "英雄联盟",
    "vps",
    "服务器",
    "书单",
    "免费",
    "限免",
    "数据分析",
    "自由职业",
    "lol",
    "react",
    "mobx",
];

class KeywordService {
    static init(setting) {
        KeywordService.Setting = setting;
    }

    static list() {
        const hasLoadKeywords = KeywordService.Setting.keywords && KeywordService.Setting.keywords.length;
        return Promise.resolve(hasLoadKeywords && KeywordService.Setting.keywords || KeywordService.DefaultKeywords);
    }
}

KeywordService.DefaultKeywords = DefaultKeywords;

module.exports = KeywordService;