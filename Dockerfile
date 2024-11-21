# Встановлення базового образу Node.js
FROM node:20

# Встановлення робочої директорії
WORKDIR /app

# Копіювання package.json та package-lock.json
COPY package*.json ./

# Встановлення залежностей
RUN npm install

# Копіювання всього коду в контейнер
COPY . .

# Компіляція TypeScript
RUN npm run build

# Вказівка порту
EXPOSE 3000

# Команда для запуску додатка
CMD ["npm", "run", "start"]
