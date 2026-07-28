#!/usr/bin/env bash
#
# Applies amplify-custom-rules.json to the Amplify app.
#
# Amplify's rewrites and redirects are normally edited in the console, which
# takes routing out of version control — the site then can't be reproduced from
# the repo alone. Keeping the rules in a JSON file and applying them with this
# script keeps them reviewable in git.
#
# Run this after any change to amplify-custom-rules.json. It replaces the full
# rule set, so the file is the single source of truth.
#
#   ./scripts/apply-amplify-rules.sh <app-id> [region] [profile]
#
set -euo pipefail

APP_ID="${1:?usage: apply-amplify-rules.sh <app-id> [region] [profile]}"
REGION="${2:-us-west-1}"
PROFILE="${3:-prod}"

RULES="$(cd "$(dirname "$0")/.." && pwd)/amplify-custom-rules.json"

echo "Applying $(python3 -c 'import json,sys;print(len(json.load(open(sys.argv[1]))))' "$RULES") rules to $APP_ID ($REGION)..."

aws amplify update-app \
  --app-id "$APP_ID" \
  --region "$REGION" \
  --profile "$PROFILE" \
  --custom-rules "file://$RULES" \
  --query 'app.customRules' \
  --output table
