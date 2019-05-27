#!/bin/bash
echo "npx browserify ./src/index.js -o ./dist/bundle.js"
npx browserify .\src\index.js -o .\dist\bundle.js
echo " = = = = = Browserify done = = = = = = "
echo "prepend greasyfork head "
sed -i '1s/^/\/\/==UserScript==\n\/\/ @name                Healthy Hentai\n\/\/ @name:zh-CN          Healthy Hentai\n\/\/ @description         Remove Bloody Galleries In hitomi\n\/\/ @description:zh-CN   移除 hitomi 中含有血腥标签的图集\n\/\/ @version             0.1.0\n\/\/ @author              jferroal\n\/\/ @license             GPL-3.0\n\/\/ @include             https:\/\/hitomi.la\/*\n\/\/ @run-at              document-idle\n\/\/ @namespace           https:\/\/greasyfork.org\/users\/34556\n\/\/ ==\/UserScript==\n\n/g' .\dist\bundle.js
echo " = = = = = prepend bundle with greasyfork head done = = = = = "
cp .\dist\bundle.js .\export\healthy-hentai.user.js
