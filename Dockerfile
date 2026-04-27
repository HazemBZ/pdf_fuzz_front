FROM docker.io/library/node:18.20.4-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --force


COPY ./ ./
RUN npm run build


FROM docker.io/library/nginx:latest

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

COPY nginx.conf.template ./

CMD ["/bin/bash", "-c" , "envsubst '$BACKEND_DOMAIN $BACKEND_PORT' < ./nginx.conf.template > /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"]
