#!/bin/bash
echo "../node_modules/.bin/browserify ./src/index.js -o ./dist/bundle.js"
../node_modules/.bin/browserify ./src/index.js -o ./dist/bundle.js
echo " = = = = = Browserify done = = = = = = "
echo "prepend greasyfork head "
sed -i.old '1s;^;\// ==UserScript==\
// @name                la-image-extractor\
// @name:zh-CN          la 图片地址复制\
// @description         copy image source in hitomi.la & notomi.la to clipboard\
// @description:zh-CN   复制 hitoma.la & notomi.la 图片链接到剪贴板\
// @version             0.1.3\
// @author              jferroal\
// @license             GPL-3.0\
// @require             https://greasyfork.org/scripts/31793-jmul/code/JMUL.js?version=209567\
// @include             https://hitomi.la/reader/*\
// @include             https://nozomi.la/tag/*\
// @run-at              document-idle\
// @namespace           https://greasyfork.org/users/34556-jferroal\
// ==/UserScript==\n\n;' ./dist/bundle.js
echo " = = = = = prepend bundle with greasyfork head done = = = = = "
rm ./dist/bundle.js.old
cp ./dist/bundle.js ./export/la-image-extractor.user.js
