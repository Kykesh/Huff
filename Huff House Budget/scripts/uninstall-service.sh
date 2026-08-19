#!/usr/bin/env bash
# Stop and remove the Huff Budget LaunchAgent.

set -euo pipefail

LABEL="com.huff.budget"
PLIST="$HOME/Library/LaunchAgents/${LABEL}.plist"

if [[ -f "$PLIST" ]]; then
  launchctl unload "$PLIST" 2>/dev/null || true
  rm -f "$PLIST"
  echo "Removed $PLIST — port 3001 is free."
else
  echo "Nothing to remove ($PLIST not present)."
fi
