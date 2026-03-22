#!/usr/bin/env bash
set -e

# TSA Webmaster - Website Startup Script
# Clears caches, checks/installs dependencies, launches dev server(s)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 Starting TSA Webmaster..."
echo ""

# ============================================================================
# 1. Clear previous caches
# ============================================================================
echo "🧹 Clearing caches..."

if [ -d "bridgebase/.next" ]; then
  rm -rf bridgebase/.next
  echo "   ✓ Cleared Next.js build cache (.next)"
fi

if [ -d "bridgebase/node_modules/.cache" ]; then
  rm -rf bridgebase/node_modules/.cache
  echo "   ✓ Cleared node_modules cache"
fi

# Clear .swc cache (Next.js/Babel)
if [ -d "bridgebase/.swc" ]; then
  rm -rf bridgebase/.swc
  echo "   ✓ Cleared SWC cache"
fi

# Clear npm cache for this project (optional - keeps global cache)
# npm cache clean --force 2>/dev/null || true

echo "   Cache clear complete."
echo ""

# ============================================================================
# 2. Check and install dependencies
# ============================================================================
echo "📦 Checking dependencies..."

APP_DEPS_OK=false
if [ -d "bridgebase/node_modules" ]; then
  # Quick check: key packages exist
  if [ -d "bridgebase/node_modules/next" ] && [ -d "bridgebase/node_modules/react" ]; then
    APP_DEPS_OK=true
  fi
fi

if [ "$APP_DEPS_OK" = false ]; then
  echo "   Installing Charlotte Connect (Next.js app) dependencies..."
  cd bridgebase && npm install && cd ..
  echo "   ✓ Dependencies installed."
else
  echo "   ✓ Dependencies already installed."
  # Optional: run npm install anyway to catch any outdated/missing deps (slower)
  # cd bridgebase && npm install --prefer-offline --no-audit --no-fund 2>/dev/null && cd .. || true
fi

echo ""

# ============================================================================
# 3. Launch dev server(s)
# ============================================================================
echo "🌐 Launching dev server..."
echo "   Frontend + API: http://localhost:3000"
echo ""
echo "   Press Ctrl+C to stop."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd bridgebase && exec npm run dev
