#!/bin/bash

# Stop script for Startup Scoring System
# Run from /opt/startup-scoring directory

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"

cd "$APP_DIR"

echo "🛑 Stopping Startup Scoring System..."

# Stop services
docker compose -f docker-compose.prod.yml down

echo "✅ Startup Scoring System stopped!"



