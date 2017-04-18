// ==UserScript==
// @name                annotation-board
// @name:zh-CN          注释墙
// @description         allow you to add annotation after selected content and copy to clipboard
// @description:zh-CN   选中内容后添加注释并复制到剪贴板
// @version             0.1.7
// @author              jferroal
// @license             GPL-3.0
// @updateURL           https://github.com/ezirmusitua/my-tamper-monkey-scripts/raw/master/highlight-my-interest.user.js
// @grant               none
// @require             https://cdn.bootcss.com/clipboard.js/1.6.1/clipboard.min.js
// @require             https://cdn.bootcss.com/jquery/3.2.1/jquery.slim.min.js
// @include             http://*
// @include             https://*
// @run-at              document-end
// @namespace           https://greasyfork.org/users/34556
// ==/UserScript==

// Features
// 1. 选中后弹出输入框添加注释
// 2. 添加的注释中需要有事件信息
// 3. 窗口关闭后/不活跃后将内容复制到剪贴板
// 4. 剪贴板中的内容需要有文章信息

function copyToClipboard() { }

function showAnnotationModal() { }
