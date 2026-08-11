#!/bin/bash
set -euo pipefail

TAG="${1:?immutable image tag required}"
REGISTRY=461701713970.dkr.ecr.us-east-1.amazonaws.com
SITE_AUTH_TOKEN=$(aws ssm get-parameter --region us-east-1 --name /problem-set-a-minus/runtime/site-auth-token --with-decryption --query Parameter.Value --output text)
ORIGIN_VERIFY_TOKEN=$(aws ssm get-parameter --region us-east-1 --name /problem-set-a-minus/runtime/origin-verify-token --with-decryption --query Parameter.Value --output text)

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin "$REGISTRY"
for image in api runner frontend; do
  docker pull "$REGISTRY/problem-set-a-minus/$image:$TAG"
done
docker tag "$REGISTRY/problem-set-a-minus/runner:$TAG" problem-set-runner:local

docker rm -f problem-set-api problem-set-frontend 2>/dev/null || true
docker run -d --name problem-set-api --restart unless-stopped --network problem-set --network-alias api --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges -v /var/lib/problem-set:/var/lib/problem-set -e NODE_ENV=production -e PORT=3001 -e CHALLENGES_DB_PATH=/var/lib/problem-set/problem-set.db -e DOCKER_HOST=tcp://docker-proxy:2375 -e EXECUTION_SANDBOX_IMAGE=problem-set-runner:local -e SITE_AUTH_TOKEN="$SITE_AUTH_TOKEN" "$REGISTRY/problem-set-a-minus/api:$TAG"
docker run -d --name problem-set-frontend --restart unless-stopped --network problem-set -p 80:8080 --cap-drop ALL --cap-add CHOWN --cap-add SETGID --cap-add SETUID --security-opt no-new-privileges -e SITE_AUTH_TOKEN="$SITE_AUTH_TOKEN" -e ORIGIN_VERIFY_TOKEN="$ORIGIN_VERIFY_TOKEN" "$REGISTRY/problem-set-a-minus/frontend:$TAG"
docker exec problem-set-frontend chmod 0644 /etc/nginx/.htpasswd
docker ps --format '{{.Names}}	{{.Image}}	{{.Status}}'
