# Build Stage

FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build -- --configuration production

# Runtime Stage

FROM nginx:alpine

COPY --from=builder \
/app/dist/angular-auth-dashboard/browser \
/usr/share/nginx/html

COPY nginx.conf \
/etc/nginx/conf.d/default.conf

EXPOSE 80