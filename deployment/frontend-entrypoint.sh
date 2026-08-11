#!/bin/sh
set -eu
: "${SITE_AUTH_TOKEN:?SITE_AUTH_TOKEN is required}"
: "${ORIGIN_VERIFY_TOKEN:?ORIGIN_VERIFY_TOKEN is required}"
SITE_AUTH_USER="${SITE_AUTH_USER:-personal}"
umask 077
envsubst '$ORIGIN_VERIFY_TOKEN' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf
htpasswd -bBc /etc/nginx/.htpasswd "$SITE_AUTH_USER" "$SITE_AUTH_TOKEN" >/dev/null
exec nginx -g 'daemon off;'
