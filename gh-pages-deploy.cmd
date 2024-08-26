pnpm run build
cd build
git init -b trunk
git add -A
git commit -m 'deploy'
git push -f git@github.com:zjjdes/position-app.git trunk:gh-pages
cd ..
rmdir /s /q build