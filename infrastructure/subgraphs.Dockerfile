# ------------ Builder ------------ #
FROM node:lts-alpine as builder
ARG APPLICATION_NAME
ENV DOCKER_BUILDKIT=1

WORKDIR /app
COPY . .
RUN corepack enable && pnpm install --ignore-scripts && pnpm ${APPLICATION_NAME} build

# ------------ Runner ------------ #
FROM node:lts-alpine as runner
ARG APPLICATION_PATH
ENV NODE_ENV=PRODUCTION

WORKDIR /app
RUN mkdir -p ${APPLICATION_PATH}/dist

COPY --from=builder /app/package.json .
COPY --from=builder /app/pnpm*.yaml .
COPY --from=builder /app/${APPLICATION_PATH}/package.json ./${APPLICATION_PATH}
COPY --from=builder /app/${APPLICATION_PATH}/schema.graphql ./${APPLICATION_PATH}/dist
COPY --from=builder /app/${APPLICATION_PATH}/dist ./${APPLICATION_PATH}/dist

# ENTRYPOINT ["tail", "-f", "/dev/null"]

RUN corepack enable && pnpm install --frozen-lockfile --ignore-scripts --prod

WORKDIR /app/${APPLICATION_PATH}/dist
CMD [ "node", "./index.js" ]