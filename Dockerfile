FROM nginx
COPY src /usr/share/nginx/html
COPY build/contracts /usr/share/nginx/html