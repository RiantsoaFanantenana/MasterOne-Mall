# -----------------------
# Stage 1 : Build
# -----------------------
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

# 👇 IMPORTANT : utiliser npm install
RUN npm install

COPY . .

RUN npm run build -- --configuration production


# -----------------------
# Stage 2 : Nginx
# -----------------------
FROM nginx:stable-alpine

# Supprimer les fichiers par défaut
RUN rm -rf /usr/share/nginx/html/*

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés
COPY --from=build /app/dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]