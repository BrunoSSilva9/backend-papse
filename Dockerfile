# 1. Imagem Base: Começamos com uma imagem oficial do Node.js.
# A versão 'alpine' é super leve, o que é ótimo para produção.
FROM node:18-alpine

# 2. Diretório de Trabalho: Define o diretório padrão dentro do contêiner.
# Todos os comandos seguintes serão executados a partir daqui.
WORKDIR /usr/src/app

# 3. Copiar Dependências: Copia os arquivos de gerenciamento de pacotes.
# Fazemos isso em um passo separado para aproveitar o cache do Docker.
# Se esses arquivos não mudarem, o Docker não reinstalará tudo de novo.
COPY package*.json ./

# 4. Instalar Dependências: Roda o comando 'npm install' dentro do contêiner.
RUN npm install

# 5. Copiar o Código-Fonte: Copia todos os outros arquivos do projeto para o contêiner.
COPY . .

# 6. Compilar o TypeScript: Roda o nosso script de 'build' para gerar o código JS.
RUN npm run build

# 7. Expor a Porta: Informa ao Docker que o contêiner escutará na porta 3000.
EXPOSE 3000

# 8. Comando de Inicialização: O comando que será executado quando o contêiner iniciar.
# Executamos o código JavaScript compilado.
CMD [ "node", "dist/server.js" ]