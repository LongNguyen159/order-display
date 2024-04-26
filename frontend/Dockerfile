# Use an official Node.js image with specific versions for frontend
FROM node:18.17.0

# Set the working directory in the container
WORKDIR /app/frontend

# Install Angular CLI globally
RUN npm install -g @angular/cli@17.3.3

# Copy package.json and install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

# Copy the rest of the frontend application
COPY . .

# Expose the port for Angular development server
EXPOSE 4200

# Command to start the frontend server
CMD ["ng", "serve", "--host", "0.0.0.0"]