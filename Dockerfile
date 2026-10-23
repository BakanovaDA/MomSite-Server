FROM node:19-alpine
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production  # Используем ci для production

# Копируем исходный код
COPY . .

# Открываем порт
EXPOSE 5000

# Запускаем приложение
CMD ["node", "server.js"]  # Или "npm", "start" если есть package.json script
FROM node:19-alpine

# указываем рабочую (корневую) директорию
WORKDIR /app

# копируем основные файлы приложения в рабочую директорию
COPY package.json ./

# устанавливаем указанные зависимости NPM на этапе установки образа
RUN npm install

# после установки копируем все файлы проекта в корневую директорию
COPY . ./

# запускаем основной скрипт в момент запуска контейнера
CMD npm start