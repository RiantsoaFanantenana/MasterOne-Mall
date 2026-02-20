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

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
