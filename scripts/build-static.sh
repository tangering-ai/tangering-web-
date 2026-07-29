#!/usr/bin/env bash
#
# Assembles the publishable site into dist/.
#
# There is no build step in the usual sense — the site is hand-written HTML,
# CSS and browser-transpiled JSX that runs straight from source. This script
# exists only to decide WHAT gets published, because Amplify serves everything
# in the artifact directory and this repo (which is PUBLIC) contains several
# things that must not be.
#
# Strategy is copy-everything-then-prune rather than an allowlist. The pages
# pull in a long tail of scripts, and an allowlist that misses one breaks the
# site silently; an over-broad copy only wastes a few KB. The prune list below
# is therefore the security-relevant part — add to it, don't switch approaches.
#
set -euo pipefail

cd "$(dirname "$0")/.."

rm -rf dist
mkdir -p dist
tar --exclude='./.git' --exclude='./dist' -cf - . | (cd dist && tar -xf -)

cd dist

# Vercel Serverless Function. Amplify Hosting does not execute it, so shipping
# it would just serve the source as a readable static file.
rm -rf api

# Not part of the site.
rm -rf .claude .github

# Verified unreferenced by any page (no hits for uploads/ or screenshots/ in
# any .html/.js/.jsx/.css). Re-check before publishing either.
rm -rf screenshots uploads

# Host config, build tooling and packaging metadata — not web content.
rm -rf scripts
rm -f package.json vercel.json amplify.yml amplify-custom-rules.json

# Stray unlinked duplicate of the landing page, and editor leftovers.
rm -f 'Tangering Landing.html'
rm -f ./*.bak

# Unreferenced root-level media. Everything the pages actually load lives in
# assets/; these are leftovers and they are large.
rm -f ./*.mp4

find . -name '.DS_Store' -delete

echo "Published files:"
find . -mindepth 1 -maxdepth 1 | sort
echo
echo "Total: $(find . -type f | wc -l | tr -d ' ') files"
