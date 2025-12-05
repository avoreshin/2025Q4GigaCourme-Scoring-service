#!/bin/bash

# Update script for Startup Scoring System
# Run from /opt/startup-scoring directory

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"

cd "$APP_DIR"

echo "🔄 Updating Startup Scoring System..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file from env.production.example"
    exit 1
fi

# Backup database before update
echo "💾 Creating database backup..."
./server/backup-db.sh || echo "⚠️  Warning: Database backup failed, continuing anyway..."

# Stop services
echo "🛑 Stopping services..."
docker compose -f docker-compose.prod.yml down

# Pull latest code (if using git)
if [ -d .git ]; then
    echo "📥 Pulling latest code..."
    git pull || echo "⚠️  Warning: Git pull failed, using current code..."
fi

# Rebuild and start services
echo "🔨 Rebuilding and starting services..."
docker compose -f docker-compose.prod.yml up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 5

# Check service status
echo "📊 Service status:"
docker compose -f docker-compose.prod.yml ps

# Clean up old images
echo "🧹 Cleaning up old Docker images..."
docker image prune -f

echo "✅ Update completed!"
echo ""
echo "To view logs: docker compose -f docker-compose.prod.yml logs -f"


