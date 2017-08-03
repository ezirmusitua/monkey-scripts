#!/bin/bash
echo "../node_modules/.bin/browserify ./src/index.js -o ./dist/bundle.js"
../node_modules/.bin/browserify ./src/index.js -o ./dist/bundle.js
echo " = = = = = Browserify done = = = = = = "
echo "prepend greasyfork head "
sed -i.old '1s;^;\// ==UserScript==\
// @name                highlight-my-interest\
// @name:zh-CN          高亮关键词\
// @description         highlight keywords in my favorites\
// @description:zh-CN   高亮特定网页中感兴趣的关键词\
// @version             0.2.1\
// @author              jferroal\
// @license             GPL-3.0\
// @grant               none\
// @require             https://greasyfork.org/scripts/31793-jmul/code/JMUL.js?version=209567\
// @include             https://sspai.com/*\
// @include             https://toutiao.io/*\
// @include             http://www.inoreader.com/*\
// @run-at              document-end\
// @namespace           https://greasyfork.org/users/34556-jferroal\
// ==/UserScript==\n\n;' ./dist/bundle.js
echo " = = = = = prepend bundle with greasyfork head done = = = = = "
rm ./dist/bundle.js.old
cp ./dist/bundle.js ./export/highlight-my-interest.user.js
