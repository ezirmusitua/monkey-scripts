// ==UserScript==
// @name         Highlight My interest
// @version      0.1.0
// @description  高亮特定网页中感兴趣的关键词
// @author       jferroal@gmail.com
// @include      https://sspai.com/*
// @include      http://toutiao.io/*
// @include      http://www.inoreader.com
// @include      http://www.52pojie.com
// @run-at       document-start
// @namespace    https://greasyfork.org/users/34556
// ==/UserScript==

const JFInterestedKeywords = [
  /.*书籍.*/,
  /.*效率.*/gi,
  /.*google.*/gi,
  /.*Nexus.*/gi,
  /.*爬虫.*/,
  /.*python.*/gi,
  /.*angular.*/gi,
  /.*node.*/gi,
  /.*javascript.*/gi,
  /.*ukulele.*/gi,
  /.*GTD.*/gi,
  /.*工作流.*/gi,
  /.*日程.*/gi,
  /.*英雄联盟.*/gi,
  /.*VPS.*/gi,
  /.*服务器.*/gi,
  /.*书单.*/gi,
  /.*免费.*/gi,
  /.*限免.*/gi,
  /.*数据分析.*/gi,
];

function getElements() {
  const targetTagNames = ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'a', 'pre', 'blockquote', 'summary'];
  return targetTagNames.reduce((res, tagName) => {
    const tags = document.getElementsByTagName(tagName);
    if (tags && tags.length) {
      res.push(...tags);
    }
    return res;
  }, []);
}

function matchKeywordsInElements() {
  const elements = getElements();
  elements.reduce((res, element) => {
    JFInterestedKeywords.forEach((keyword) => {
      const isMatched = keyword.test(element.innerText);
      if (isMatched) {
        element.style.backgroundColor = '#FFDA5E';
      }
    });
  });
}

matchKeywordsInElements();


