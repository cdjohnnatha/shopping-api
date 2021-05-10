# Imagem de Origem
FROM node:16-alpine
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
# ENV NODE_ENV production
COPY package.json ./

RUN npm install --legacy-peer-deps

COPY . .

# Inicializa a aplicação
CMD ["npm", "start"]