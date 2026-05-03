#!/usr/bin/env bash
# Helix Amino frontend deploy script.
# Pulls the latest dist.tar.gz from Supabase storage, extracts it into a
# timestamped release directory owned by linuxuser, atomically swaps the
# /var/www/helix/current symlink, and reloads nginx.
#
# Install:
#   sudo install -m 0755 scripts/deploy.sh /usr/local/bin/helix-deploy
#
# Run:
#   sudo helix-deploy

set -euo pipefail

DIST_URL="${DIST_URL:-https://eactfxpjobttmxlhtoje.supabase.co/storage/v1/object/public/dist-releases/dist.tar.gz}"
DEPLOY_USER="${DEPLOY_USER:-linuxuser}"
BASE="${BASE:-/var/www/helix}"
RELEASES="$BASE/releases"
CURRENT="$BASE/current"
KEEP="${KEEP:-5}"

if [[ $EUID -ne 0 ]]; then
  echo "helix-deploy must be run as root (try: sudo helix-deploy)" >&2
  exit 1
fi

TS="$(date +%Y%m%d%H%M%S)"
NEW="$RELEASES/$TS"

echo "==> Preparing release $TS"
install -d -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$RELEASES"
sudo -u "$DEPLOY_USER" mkdir -p "$NEW"

echo "==> Downloading $DIST_URL"
sudo -u "$DEPLOY_USER" curl -fL --retry 3 -o "$NEW/dist.tar.gz" "$DIST_URL"

echo "==> Extracting"
sudo -u "$DEPLOY_USER" tar -xzf "$NEW/dist.tar.gz" -C "$NEW"
sudo -u "$DEPLOY_USER" rm -f "$NEW/dist.tar.gz"

# Some tarballs extract a top-level dist/ dir; normalize so $NEW itself is the webroot
if [[ -d "$NEW/dist" && ! -f "$NEW/index.html" ]]; then
  echo "==> Flattening dist/ subdirectory"
  sudo -u "$DEPLOY_USER" bash -c "shopt -s dotglob && mv '$NEW/dist'/* '$NEW'/ && rmdir '$NEW/dist'"
fi

echo "==> Swapping symlink -> $NEW"
ln -sfn "$NEW" "$CURRENT.new"
mv -Tf "$CURRENT.new" "$CURRENT"

echo "==> Testing and reloading nginx"
nginx -t
systemctl reload nginx

echo "==> Pruning old releases (keeping last $KEEP)"
# shellcheck disable=SC2012
ls -1dt "$RELEASES"/*/ 2>/dev/null | tail -n +"$((KEEP + 1))" | while read -r old; do
  echo "    rm $old"
  rm -rf "$old"
done

echo "==> Done. Active release: $(readlink -f "$CURRENT")"
