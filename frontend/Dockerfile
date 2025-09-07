FROM node:20-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV production

CMD ["npm", "start"]