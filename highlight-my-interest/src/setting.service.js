const Setting = require('./setting').Setting;
const { Request } = window.JMUL || { JMUL: {} };

const DefaultKeywords = [
  '书籍',
  '效率',
  'google.*?',
  'nexus.*?',
  '爬虫',
  'python.*?',
  'angular.*?',
  'node',
  'javascript',
  'ukulele',
  /gtd.*?/gi,
  '工作流',
  '日程',
  '英雄联盟',
  'vps',
  '服务器',
  '书单',
  '免费',
  '限免',
  '数据分析',
  '自由职业',
  'lol',
  'react',
  'mobx',
];

const DefaultResponseHandler = (_response) => {
  let response = _response;
  if (typeof _response === 'object' && _response.responseText) {
    response = _response.responseText;
  }
  return new Setting(JSON.parse(response));
};

class SettingService {
  static init (config) {
    SettingService.loadUrl = config.loadUrl;
    SettingService.method = config.method || 'GET';
    SettingService.contentType = config.contentType || 'application/json';
    SettingService.data = config.data || {};
    SettingService.resHandler = config.resHandler || DefaultResponseHandler;
  }

  static load () {
    if (!SettingService.loadUrl) return Promise.resolve(SettingService.DefaultSetting);
    const request = new Request({ headers: { 'content-type': SettingService.contentType } });
    request.setUrl(SettingService.loadUrl);
    request.setMethod(SettingService.method);
    request.setData(SettingService.data);
    return request.send().then((response) => {
      return SettingService.resHandler(response.responseText);
    });
  }
}

SettingService.DefaultSetting = {
  highlightBgColor: '#FFDA5E',
  highlightTxtColor: 'black',
  keywords: {
    'https://sspai.com/*': DefaultKeywords,
    'https://toutiao.io/*': DefaultKeywords,
    'http://www.inoreader.com/*': DefaultKeywords,
  },
};

module.exports = SettingService;
