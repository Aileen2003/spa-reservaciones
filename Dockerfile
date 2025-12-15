# Imagen base
FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Puerto que usa la app
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "run", "dev"]
