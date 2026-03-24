#!/usr/bin/env bash
set -e

# TSA Webmaster - Website Startup Script
# Supports both development and production modes

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Detect if we're in production (Railway sets PORT)
if [ -n "$PORT" ] || [ "$NODE_ENV" = "production" ]; then
  MODE="production"
else
  MODE="development"
fi

echo "🚀 Starting TSA Webmaster in $MODE mode..."
echo ""

cd bridgebase

if [ "$MODE" = "production" ]; then
  # ============================================================================
  # PRODUCTION MODE (Railway/Hosting)
  # ============================================================================
  echo "📦 Installing dependencies..."
  npm ci --only=production || npm install --only=production
  echo "   ✓ Dependencies installed."
  echo ""
  
  echo "🔨 Building application..."
  npm run build
  echo "   ✓ Build complete."
  echo ""
  
  echo "🌐 Starting production server on port ${PORT:-3000}..."
  exec npm run start
  
else
  # ============================================================================
  # DEVELOPMENT MODE (Local)
  # ============================================================================
  echo "🧹 Clearing caches..."
  
  if [ -d ".next" ]; then
    rm -rf .next
    echo "   ✓ Cleared Next.js build cache (.next)"
  fi
  
  if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    echo "   ✓ Cleared node_modules cache"
  fi
  
  if [ -d ".swc" ]; then
    rm -rf .swc
    echo "   ✓ Cleared SWC cache"
  fi
  
  echo "   Cache clear complete."
  echo ""
  
  echo "📦 Checking dependencies..."
  if [ ! -d "node_modules/next" ] || [ ! -d "node_modules/react" ]; then
    echo "   Installing dependencies..."
    npm install
    echo "   ✓ Dependencies installed."
  else
    echo "   ✓ Dependencies already installed."
  fi
  echo ""
  
  echo "🌐 Launching dev server..."
  echo "   Frontend + API: http://localhost:3000"
  echo ""
  echo "   Press Ctrl+C to stop."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  exec npm run dev
fi
