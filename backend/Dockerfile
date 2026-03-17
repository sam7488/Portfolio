FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema & generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code
COPY . .

EXPOSE 5000

# Run migrations, seed, then start the server
CMD sh -c "npx prisma migrate deploy && node prisma/seed.js && node src/index.js"
