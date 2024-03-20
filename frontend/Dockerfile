FROM node:18-alpine AS dev
WORKDIR /app
COPY . .
RUN npm ci 
ENV NODE_ENV development
EXPOSE 3000
CMD ["npm", "run", "start"]