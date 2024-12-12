FROM node:21

WORKDIR /app

COPY ./package.json ./package.json

COPY ./package-lock.json ./package-lock.json

RUN npm install 

COPY ./src ./src

COPY ./prisma ./prisma

COPY /.env ./.env

COPY ./tsconfig.json ./tsconfig.json

RUN npx prisma generate

RUN npm run build

CMD ["npm", "run", "start:prod"]

EXPOSE 3000