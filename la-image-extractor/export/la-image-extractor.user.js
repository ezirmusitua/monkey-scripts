// ==UserScript==
// @name                la-image-extractor
// @name:zh-CN          la 图片地址复制
// @description         copy image source in hitomi.la  notomi.la to clipboard
// @description:zh-CN   复制图片链接到剪贴板
// @version             0.1.1
// @author              jferroal
// @license             GPL-3.0
// @require             https://greasyfork.org/scripts/31793-jmul/code/JMUL.js?version=209567
// @include             https://hitomi.la/*
// @include             https://nozomi.la/*
// @run-at              document-end
// @namespace           https://greasyfork.org/users/34556-jferroal
// ==/UserScript==

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
  const href = window.location.href
  const isHitomi = /hitomi/gi.test(href)
  // prepare str2Paste
  let [imgSrcSelector, titleSelector] = ['.tag-list-img', 'h1']
  if (isHitomi) {
    imgSrcSelector = '.img-url'
    titleSelector = 'title'
  }
  let srcs = Array.from(document.querySelectorAll(imgSrcSelector))
  let title = document.querySelector(titleSelector).innerText
  if (isHitomi) {
    title = title.split(' | ')[0]
    const magic = parseInt(window.location.href.split('/').slice(-1)[0][1]) % 2
    if (Number.isNaN(magic)) {
      srcs = []
    } else {
      srcs = srcs.map(s => s.innerText.replace('//g.hitomi.la', `https://${String.fromCharCode(magic + 97)}a.hitomi.la`))
    }
  } else {
    srcs = srcs.map(s => s.src.replace('//tn', '//i').split('.').slice(0, 4).join('.'))
  }
  const str2paste = `${title}\n${srcs.join('\n')}${'\n = ='.repeat(20)}`
  // create button to click
  const btn = document.createElement('div')
  btn.innerText = 'Copy Sources'
  btn.style.textAlign = 'center'
  btn.style.width = '80px'
  btn.style.lineHeight = '40px'
  btn.style.backgroundColor = 'skyblue'
  btn.style.color = 'white'
  btn.style.cursor = 'pointer'
  btn.style.borderRadius = '8px'
  btn.style.boxShadow = '0px 0px 8px 4px rgba(0, 0, 0, .2)'
  btn.style.position = 'fixed'
  btn.style.right = '80px'
  btn.style.bottom = '80px'
  document.body.appendChild(btn)
  // bind copy event
  btn.addEventListener('click', () => {
    const el = document.createElement('textarea')
    el.value = str2paste
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  })
})()

},{}]},{},[1]);
