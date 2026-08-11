FROM public.ecr.aws/docker/library/node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates docker.io && rm -rf /var/lib/apt/lists/*
RUN groupadd --gid 65532 problemset && useradd --uid 65532 --gid 65532 --create-home --shell /usr/sbin/nologin problemset && mkdir -p /opt/problem-set/backend /var/lib/problem-set && chown -R problemset:problemset /opt/problem-set /var/lib/problem-set
USER 65532:65532
WORKDIR /opt/problem-set/backend
COPY --chown=65532:65532 backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --chown=65532:65532 backend /opt/problem-set/backend
COPY --chown=65532:65532 data /opt/problem-set/data
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "src/server.js"]
