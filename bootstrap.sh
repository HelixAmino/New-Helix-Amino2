#!/usr/bin/env bash
# Helix Amino frontend bootstrap for a fresh Ubuntu 22.04/24.04 VPS.
# Run as root:
#   curl -fsSL https://eactfxpjobttmxlhtoje.supabase.co/storage/v1/object/public/dist-releases/bootstrap.sh | bash
set -euo pipefail

DIST_URL="https://eactfxpjobttmxlhtoje.supabase.co/storage/v1/object/public/dist-releases/dist.tar.gz"
SITE_DIR="/var/www/helixamino"
SERVER_NAME="_"

echo "==> Updating apt and installing nginx + curl"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y nginx curl ca-certificates

echo "==> Preparing $SITE_DIR"
mkdir -p "$SITE_DIR"
rm -rf "$SITE_DIR/dist" "$SITE_DIR/dist.tar.gz"

echo "==> Downloading dist tarball"
curl -fL --retry 3 -o "$SITE_DIR/dist.tar.gz" "$DIST_URL"

echo "==> Extracting"
tar -xzf "$SITE_DIR/dist.tar.gz" -C "$SITE_DIR"
rm -f "$SITE_DIR/dist.tar.gz"
chown -R www-data:www-data "$SITE_DIR/dist"

echo "==> Writing nginx config"
cat > /etc/nginx/sites-available/helixamino <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name ${SERVER_NAME};

    root ${SITE_DIR}/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files \$uri =404;
    }

    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;
}
EOF

ln -sf /etc/nginx/sites-available/helixamino /etc/nginx/sites-enabled/helixamino
rm -f /etc/nginx/sites-enabled/default

echo "==> Testing and reloading nginx"
nginx -t
systemctl enable nginx
systemctl restart nginx

IP=$(curl -fsS https://api.ipify.org || hostname -I | awk '{print $1}')
echo ""
echo "=============================================="
echo " Deploy complete."
echo " Visit: http://${IP}/"
echo "=============================================="
