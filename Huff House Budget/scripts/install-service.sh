#!/usr/bin/env bash
# Install the Huff Budget site as a macOS LaunchAgent so it auto-starts
# at login and stays running in the background (port 3001).
#
# After install: http://localhost:3001/ should always work.
# To stop it later: ./scripts/uninstall-service.sh

set -euo pipefail

LABEL="com.huff.budget"
PLIST="$HOME/Library/LaunchAgents/${LABEL}.plist"
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
NODE_BIN="$(command -v node || true)"

if [[ -z "$NODE_BIN" ]]; then
  echo "Error: node not found on PATH. Install Node (https://nodejs.org) and retry."
  exit 1
fi

mkdir -p "$HOME/Library/LaunchAgents"

# Stop any prior version before re-installing.
if launchctl list | grep -q "${LABEL}"; then
  echo "Unloading existing ${LABEL}..."
  launchctl unload "$PLIST" 2>/dev/null || true
fi

cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${LABEL}</string>

  <key>ProgramArguments</key>
  <array>
    <string>${NODE_BIN}</string>
    <string>${PROJECT_ROOT}/server.js</string>
  </array>

  <key>EnvironmentVariables</key>
  <dict>
    <key>PORT</key>
    <string>3001</string>
    <key>PATH</key>
    <string>/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin</string>
  </dict>

  <key>WorkingDirectory</key>
  <string>${PROJECT_ROOT}</string>

  <key>RunAtLoad</key>
  <true/>

  <key>KeepAlive</key>
  <true/>

  <key>StandardOutPath</key>
  <string>${PROJECT_ROOT}/data/server.log</string>

  <key>StandardErrorPath</key>
  <string>${PROJECT_ROOT}/data/server.error.log</string>
</dict>
</plist>
EOF

echo "Wrote $PLIST"
launchctl load -w "$PLIST"

# Wait up to ~10s for the port to come up (launchd needs a beat).
for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/ | grep -q "302\|200"; then
    echo ""
    echo "Huff Budget is running:"
    echo "    http://localhost:3001/"
    echo ""
    echo "Logs: ${PROJECT_ROOT}/data/server.log"
    echo "Stop: ./scripts/uninstall-service.sh"
    exit 0
  fi
  sleep 1
done

echo ""
echo "Service loaded but didn't respond within 10s."
echo "Check ${PROJECT_ROOT}/server/server.error.log"
exit 1
