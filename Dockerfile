# Étape 1 : build de l'application
FROM node:20-alpine AS build

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le projet
COPY . .

# Build de l'application pour la production
RUN npm run build

# Étape 2 : servir l'application avec Nginx
FROM nginx:alpine

# Copier les fichiers build dans le dossier de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Créer la structure des traductions pour vue-i18n
RUN mkdir -p /usr/share/nginx/html/locales/fr \
    && mkdir -p /usr/share/nginx/html/locales/en

# Copier les fichiers de traduction
COPY locales/fr.json /usr/share/nginx/html/locales/fr/translation.json
COPY locales/en.json /usr/share/nginx/html/locales/en/translation.json

# Copier la configuration Nginx pour proxy /api et /uploads vers le backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Commande pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
