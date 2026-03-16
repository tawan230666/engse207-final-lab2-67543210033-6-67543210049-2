FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY init.sql ./
COPY src/ ./src/
EXPOSE 3003
CMD ["node", "src/index.js"]
