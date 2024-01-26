npm run render-gfm -- themes --output-dir ./docs/css/
npm run render-gfm -- markdown --output-dir ./docs/ README.md
mv ./docs/README.html ./docs/index.html
mkdir --parents ./docs/pages/
cp ./README.md ./docs/pages/README.md
