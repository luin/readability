cp package.json _package.json &&
bump=`conventional-recommended-bump -p angular` &&
echo ${1:-$bump} &&
npm --no-git-tag-version version ${1:-$bump} &>/dev/null &&
conventional-changelog -i CHANGELOG.md -w -p angular &&
git add CHANGELOG.md &&
version=`cat package.json | json version` &&
git commit -m"docs(CHANGELOG): $version" &&
mv -f _package.json package.json &&
npm version ${1:-$bump} -m "chore(release): %s" &&
git push --follow-tags &&
conventional-github-releaser -p angular &&
npm publish
