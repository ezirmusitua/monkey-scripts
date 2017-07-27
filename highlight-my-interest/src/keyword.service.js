const InterestedKeywords = [
    "书籍",
    "效率",
    "google",
    "Nexus",
    "爬虫",
    "python",
    "angular",
    "node",
    "javascript",
    "ukulele",
    "GTD",
    "工作流",
    "日程",
    "英雄联盟",
    "VPS",
    "服务器",
    "书单",
    "免费",
    "限免",
    "数据分析",
    "自由职业",
];

class KeywordService {
    static list(forceLoad = false) {
        return new Promise((resolve) => {
            if (forceLoad) {
                // load from server;
            }
            resolve(KeywordService.InterestedKeywords);
        });

    }
}
KeywordService.InterestedKeywords = InterestedKeywords;

module.exports = KeywordService;