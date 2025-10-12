FROM node:20

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install --prod

COPY . .

# Build TypeScript
RUN pnpm run build

CMD ["pnpm", "start"]