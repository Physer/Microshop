# ------------ Builder ------------ #
FROM node:lts-alpine as builder
ARG APPLICATION_NAME
ENV DOCKER_BUILDKIT=1

WORKDIR /app

COPY . .

RUN corepack enable && pnpm install --ignore-scripts && pnpm ${APPLICATION_NAME} build
# ENTRYPOINT ["tail", "-f", "/dev/null"]


# ------------ Runner ------------ #
FROM node:lts-alpine as runner
ARG APPLICATION_PATH
ENV NODE_ENV=PRODUCTION

WORKDIR /app

COPY --from=builder /app/package.json .
COPY --from=builder /app/${APPLICATION_PATH}/package.json ./${APPLICATION_PATH}
COPY --from=builder /app/${APPLICATION_PATH}/schema.graphql ./${APPLICATION_PATH}
COPY --from=builder /app/${APPLICATION_PATH}/dist ./${APPLICATION_PATH}

RUN corepack enable && pnpm fetch --prod

CMD [ "node ./index.js" ]