#!/bin/bash

# Script to get SSL certificate using Certbot
# Run this script on the server after Nginx is configured with HTTP

set -e

if [ -z "$1" ]; then
    echo "❌ Error: Domain name is required"
    echo "Usage: ./server/get-ssl.sh your-domain.com [email@example.com]"
    exit 1
fi

DOMAIN=$1
EMAIL=${2:-admin@$DOMAIN}
APP_DIR="/opt/startup-scoring"

echo "🔒 Getting SSL certificate for $DOMAIN..."

# Switch to HTTPS config
echo "📝 Switching to HTTPS configuration..."
sudo cp ${APP_DIR}/nginx/startup-scoring.conf /etc/nginx/sites-available/startup-scoring

# Update domain name in config
sudo sed -i "s/server_name _;/server_name $DOMAIN;/g" /etc/nginx/sites-available/startup-scoring

# Temporarily comment out SSL directives for initial certbot run
sudo sed -i 's/^[[:space:]]*ssl_certificate/#ssl_certificate/g' /etc/nginx/sites-available/startup-scoring
sudo sed -i 's/^[[:space:]]*ssl_certificate_key/#ssl_certificate_key/g' /etc/nginx/sites-available/startup-scoring
sudo sed -i 's/^[[:space:]]*ssl_protocols/#ssl_protocols/g' /etc/nginx/sites-available/startup-scoring
sudo sed -i 's/^[[:space:]]*ssl_ciphers/#ssl_ciphers/g' /etc/nginx/sites-available/startup-scoring
sudo sed -i 's/^[[:space:]]*ssl_prefer_server_ciphers/#ssl_prefer_server_ciphers/g' /etc/nginx/sites-available/startup-scoring
sudo sed -i 's/^[[:space:]]*ssl_session_cache/#ssl_session_cache/g' /etc/nginx/sites-available/startup-scoring
sudo sed -i 's/^[[:space:]]*ssl_session_timeout/#ssl_session_timeout/g' /etc/nginx/sites-available/startup-scoring
sudo sed -i 's/listen 443 ssl http2;/listen 443;/g' /etc/nginx/sites-available/startup-scoring
sudo sed -i 's/listen \[::\]:443 ssl http2;/listen [::]:443;/g' /etc/nginx/sites-available/startup-scoring

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Get SSL certificate (Certbot will automatically update the config)
echo "📜 Requesting SSL certificate from Let's Encrypt..."
sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx

echo "✅ SSL certificate installed successfully!"
echo ""
echo "Your site is now available at: https://$DOMAIN"
echo "Certificate will auto-renew. To test renewal: sudo certbot renew --dry-run"

