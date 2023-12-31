FROM node:latest

WORKDIR /usr/src

COPY package*.json ./
RUN yarn

# Bundle app source inside the Docker image
COPY . .

# Expose port 3000 for the server
EXPOSE 3000

# Start the server.js file
CMD ["node", "src/config/server.js"]