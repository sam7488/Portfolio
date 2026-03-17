FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

EXPOSE 5173

# Start Vite dev server, listening on all interfaces so Docker can expose it
CMD ["npx", "vite", "--host", "0.0.0.0"]
