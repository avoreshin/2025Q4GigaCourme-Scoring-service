#!/bin/bash

# Database backup script for Startup Scoring System
# Run from /opt/startup-scoring directory

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="${APP_DIR}/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/scoring_db_${DATE}.sql"

cd "$APP_DIR"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "💾 Creating database backup..."

# Check if postgres container is running
if ! docker ps | grep -q scoring_postgres; then
    echo "❌ Error: PostgreSQL container is not running!"
    exit 1
fi

# Create backup
docker exec scoring_postgres pg_dump -U scoring_user scoring_db > "$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

# Get backup size
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)

echo "✅ Backup created: $BACKUP_FILE ($BACKUP_SIZE)"

# Keep only last 7 days of backups
echo "🧹 Cleaning old backups (keeping last 7 days)..."
find "$BACKUP_DIR" -name "scoring_db_*.sql.gz" -mtime +7 -delete

echo "✅ Backup completed!"


