FROM node:18-slim as builder
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
ENV NODE_ENV="development"
COPY . .
RUN npm run build

FROM node:18-slim as production
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --production
RUN npm cache clean --force
ENV NODE_ENV="production"
COPY --from=builder /usr/src/app/lib ./lib
CMD [ "npm", "start" ]
