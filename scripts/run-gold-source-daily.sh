#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

pushd "$ROOT_DIR/backend" >/dev/null
set +e
GOLD_SOURCE_MODE=all NODE_OPTIONS=--experimental-vm-modules npm run test:gold
status=$?
set -e
popd >/dev/null

if [ $status -ne 0 ]; then
  osascript -e 'display notification "Gold source validation failed. See terminal output." with title "Problem Set"'
  exit $status
fi
