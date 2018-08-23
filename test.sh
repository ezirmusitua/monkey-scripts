#!/usr/bin/env bash
node_modules/.bin/browserify $1/src/index.js -o $1/dist/bundle.js
python -m http.server