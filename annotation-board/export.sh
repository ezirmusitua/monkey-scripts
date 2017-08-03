#!/bin/bash
echo "../node_modules/.bin/browserify ./src/index.js -o ./dist/bundle.js"
../node_modules/.bin/browserify ./src/index.js -o ./dist/bundle.js
echo " = = = = = Browserify done = = = = = = "
echo "prepend greasyfork head "
sed -i.old '1s;^;\// ==UserScript==\
// ==UserScript==\
// @name                annotation-board\
// @name:zh-CN          注释墙\
// @description         allow you to add annotation after selected content and copy to clipboard and save to local server\
// @description:zh-CN   选中内容后添加注释并复制到剪贴板, 同时在本地的服务其中新建一个副本, 参见 https://github.com/ezirmusitua/snippet-board\
// @version             0.2.0\
// @author              jferroal\
// @license             GPL-3.0\
// @updateURL           https://github.com/ezirmusitua/my-tamper-monkey-scripts/raw/master/annotation-board.user.js\
// @require             https://greasyfork.org/scripts/31793-jmul/code/JMUL.js?version=209567\
// @include             http://*\
// @include             https://*\
// @grant               GM_xmlhttpRequest\
// @run-at              document-start\
// @namespace           https://greasyfork.org/users/34556\
// ==/UserScript==\n\n;' ./dist/bundle.js
echo " = = = = = prepend bundle with greasyfork head done = = = = = "
rm ./dist/bundle.js.old
cp ./dist/bundle.js ./export/highlight-my-interest.user.js
