#!/bin/bash
echo "../node_modules/.bin/browserify ./src/index.js -o ./dist/bundle.js"
../node_modules/.bin/browserify ./src/index.js -o ./dist/bundle.js
echo " = = = = = Browserify done = = = = = = "
echo "prepend greasyfork head "
sed -i.old '1s;^;\// ==UserScript==\
// @name                pure reading\
// @name:zh-CN          阅读模式\
// @description         Update site style for reading \
// @description:zh-CN   修改特定网站界面的样式以便阅读\
// @version             0.1.0\
// @author              jferroal\
// @license             GPL-3.0\
// @updateURL           https://github.com/ezirmusitua/my-tamper-monkey-scripts/raw/master/pure-reading.user.js\
// @require             https://greasyfork.org/scripts/31793-jmul/code/JMUL.js?version=209567\
// @include             http://*\
// @include             https://*\
// @run-at              document-end\
// @namespace           https://greasyfork.org/users/34556\
// ==/UserScript==\n\n;' ./dist/bundle.js
echo " = = = = = prepend bundle with greasyfork head done = = = = = "
rm ./dist/bundle.js.old
cp ./dist/bundle.js ./export/pure-reading.user.js
