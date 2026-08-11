FROM public.ecr.aws/docker/library/node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates docker.io && rm -rf /var/lib/apt/lists/*
WORKDIR /opt/problem-set
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci --omit=dev && npm cache clean --force
COPY backend ./backend
COPY data ./data
RUN groupadd --gid 65532 problemset && useradd --uid 65532 --gid 65532 --create-home --shell /usr/sbin/nologin problemset && mkdir -p /var/lib/problem-set && chown -R problemset:problemset /opt/problem-set /var/lib/problem-set
USER 65532:65532
WORKDIR /opt/problem-set/backend
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "src/server.js"]
