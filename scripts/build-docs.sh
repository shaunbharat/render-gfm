npm run render-gfm -- themes --output-dir ./docs/css/
npm run render-gfm -- markdown --output-dir ./docs/ README.md
mkdir --parents ./docs/pages/
cp ./README.md ./docs/pages/README.md
