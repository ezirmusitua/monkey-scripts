const Setting = require('./setting').Setting
const {Request} = window.JMUL || {JMUL: {}}

const DefaultKeywords = [
  {
    'str': 'react',
    'title': 'react',
    'type': 'programming'
  },
  {
    'str': '爬虫',
    'title': '爬虫',
    'type': 'programming'
  },
  {
    'str': '数据',
    'title': '数据'
  },
  {
    'str': 'android',
    'title': 'android',
    'type': 'programming'
  },
  {
    'str': 'javascript',
    'title': 'javascript',
    'type': 'programming'
  },
  {
    'str': 'flask',
    'title': 'flask',
    'type': 'programming'
  },
  {
    'str': '框架',
    'title': '框架'
  },
  {
    'str': '限免',
    'title': '限免',
    'type': 'software'
  },
  {
    'str': '智能家居',
    'title': '智能家居'
  },
  {
    'str': '笔记',
    'title': '笔记'
  },
  {
    'str': '手账',
    'title': '手账'
  },
  {
    'str': 'google',
    'title': 'google'
  },
  {
    'str': '谷歌',
    'title': '谷歌'
  },
  {
    'str': '书籍',
    'title': '书籍'
  }
]

const DefaultResponseHandler = (_response) => {
  let response = _response
  if (typeof _response === 'object' && _response.responseText) {
    response = _response.responseText
  }
  return new Setting(JSON.parse(response))
}

class SettingService {
  static init(config) {
    SettingService.loadUrl = config.loadUrl
    SettingService.method = config.method || 'GET'
    SettingService.contentType = config.contentType || 'application/json'
    SettingService.data = config.data || {}
    SettingService.resHandler = config.resHandler || DefaultResponseHandler
  }

  static load() {
    if (!SettingService.loadUrl) return Promise.resolve(SettingService.DefaultSetting)
    const request = new Request({headers: {'content-type': SettingService.contentType}})
    request.setUrl(SettingService.loadUrl)
    request.setMethod(SettingService.method)
    request.setData(SettingService.data)
    return request.send().then((response) => {
      return SettingService.resHandler(response.responseText)
    })
  }
}

SettingService.DefaultSetting = {
  color: {
    default: {
      bg: '#FFDA5E',
      text: 'black'
    }
  },
  keywords: {
    'https://sspai.com/*': DefaultKeywords,
    'https://toutiao.io/*': DefaultKeywords,
    'http://www.inoreader.com/*': DefaultKeywords,
  },
}

module.exports = SettingService
