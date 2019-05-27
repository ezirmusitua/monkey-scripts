#!/bin/bash
echo "browserify ./src/index.js -o ./dist/bundle.js"
npx browserify .\src\index.js -o .\dist\bundle.js
echo " = = = = = Browserify done = = = = = = "
echo "prepend greasyfork head "
sed -i.old '1s;^;\// ==UserScript==\
// @name                Download In JavLibrary\
// @name:zh-CN          JavLibrary 下载\
// @description         Download directly in javlibrary video detail page\
// @description:zh-CN   直接在 javlibrary 影片详情页进行下载\
// @version             0.3.0\
// @author              jferroal\
// @license             GPL-3.0\
// @updateURL           https://github.com/ezirmusitua/my-tamper-monkey-scripts/raw/master/jav-download-control-panel.user.js\
// @require             https://greasyfork.org/scripts/31793-jmul/code/JMUL.js?version=209567\
// @include             http://www.javlibrary.com/*\
// @grant               GM_xmlhttpRequest\
// @run-at              document-end\
// @namespace           https://greasyfork.org/users/34556\
// ==/UserScript==\n\n;' .\dist\bundle.js
echo " = = = = = prepend bundle with greasyfork head done = = = = = "
rm .\dist\bundle.js.old
cp .\dist\bundle.js .\export\jav-download-control-panel.user.js
