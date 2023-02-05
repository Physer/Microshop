# ------------ Application-specific arguments ------------ #
ARG APPLICATION_NAME
# ------------ Builder ------------ #
FROM node:lts-alpine as builder
RUN npm install -g pnpm
ENV DOCKER_BUILDKIT=1
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile && \
pnpm $APPLICATION_NAME build
RUN rm -rf node_modules && \
pnpm install --ignore-scripts --prod

# ------------ Runner ------------ #
FROM node:lts-alpine as runner
RUN npm install -g pnpm
ENV NODE_ENV=PRODUCTION
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist .
EXPOSE 3000
CMD [ "pnpx", "node ./index.js" ]