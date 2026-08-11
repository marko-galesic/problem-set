FROM public.ecr.aws/docker/library/node:22-alpine AS build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend ./
RUN npm run build
FROM public.ecr.aws/nginx/nginx:1.27-alpine
RUN apk add --no-cache apache2-utils
COPY deployment/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY deployment/frontend-entrypoint.sh /usr/local/bin/problem-set-frontend
COPY --from=build /app/dist /usr/share/nginx/html
RUN chmod 0555 /usr/local/bin/problem-set-frontend
ENTRYPOINT ["/usr/local/bin/problem-set-frontend"]
EXPOSE 8080
