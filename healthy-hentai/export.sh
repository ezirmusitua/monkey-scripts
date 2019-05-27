#!/bin/bash
echo "npx browserify ./src/index.js -o ./dist/bundle.js"
npx browserify ./src/index.js -o ./dist/bundle.js
echo " = = = = = Browserify done = = = = = = "
echo "prepend greasyfork head "
sed -i.old '1s;^;\// ==UserScript==\
// @name                Healthy Hentai\
// @name:zh-CN          Healthy Hentai\
// @description         Remove Bloody Galleries In hitomi\
// @description:zh-CN   移除 hitomi 中含有血腥标签的图集\
// @version             0.1.0\
// @author              jferroal\
// @license             GPL-3.0\
// @include             https://hitomi.la/*\
// @run-at              document-idle\
// @namespace           https://greasyfork.org/users/34556\
// ==/UserScript==\n\n;' ./dist/bundle.js
echo " = = = = = prepend bundle with greasyfork head done = = = = = "
rm ./dist/bundle.js.old
cp ./dist/bundle.js ./export/healthy-hentai.user.js
