# Usa uma imagem oficial do Node.js como base.
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner.
# Todos os comandos a seguir serão executados a partir deste diretório.
WORKDIR /app

# Copia os arquivos de definição de dependências para o contêiner.
COPY package*.json ./

# Instala as dependências do projeto.
RUN npm install

# Copia o código-fonte da sua aplicação para dentro do contêiner.
COPY ./src ./src

# Expõe a porta 3000, informando ao Docker que nossa aplicação escuta nesta porta.
EXPOSE 3000

# O comando que será executado quando o contêiner iniciar.
CMD ["node", "src/app.js"]