FROM node:19-alpine As development

WORKDIR /app

COPY /package*.json .
RUN npm install

COPY . .
RUN npm run build

FROM node:19-alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY /package*.json .
RUN npm install --prod

COPY --from=development /app/dist ./dist

CMD ["node", "dist/apps/auth/main"]