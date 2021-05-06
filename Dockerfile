# Imagem de Origem
FROM node:16-alpine
# Diretório de trabalho(é onde a aplicação ficará dentro do container).
WORKDIR /usr/src/app
# Adicionando `/app/node_modules/.bin` para o $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH
ENV NODE_ENV production
# Instalando dependências da aplicação e armazenando em cache.
COPY package.json ./

RUN npm install --silent

COPY . .

# Inicializa a aplicação
CMD ["npm", "start"]