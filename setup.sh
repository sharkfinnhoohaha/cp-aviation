#!/usr/bin/env bash
set -euo pipefail

REQUIRED_NODE_MAJOR=18

if ! command -v node >/dev/null 2>&1; then
  echo "Error: node is not installed. Install Node.js >= ${REQUIRED_NODE_MAJOR}." >&2
  exit 1
fi

node_major=$(node -p "process.versions.node.split('.')[0]")
if [ "$node_major" -lt "$REQUIRED_NODE_MAJOR" ]; then
  echo "Error: Node.js >= ${REQUIRED_NODE_MAJOR} required (found $(node -v))." >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm is not installed." >&2
  exit 1
fi

cd "$(dirname "$0")"

echo "Installing dependencies..."
npm ci

echo ""
echo "Setup complete. Next steps:"
echo "  npm run dev    # start the dev server"
echo "  npm run build  # production build"
