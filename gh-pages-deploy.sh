#!/usr/bin/env bash

# abort on errors
set -e

# build
pnpm run build

# deploy build directory
cd build
git init -b trunk
git add -A
git commit -m 'deploy'
git push -f git@github.com:zjjdes/position-app.git trunk:gh-pages
cd -

# remove build directory
rm -rf build