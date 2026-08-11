#!/bin/sh
set -eu
: "${SITE_AUTH_TOKEN:?SITE_AUTH_TOKEN is required}"
SITE_AUTH_USER="${SITE_AUTH_USER:-personal}"
umask 077
htpasswd -bBc /etc/nginx/.htpasswd "$SITE_AUTH_USER" "$SITE_AUTH_TOKEN" >/dev/null
exec nginx -g 'daemon off;'
