# Building frontend
FROM node:latest AS react-realworld-frontend
WORKDIR /usr/src/app
RUN git clone git@github.com:khaledosman/react-redux-realworld-example-app.git frontend/react-realworld
COPY frontend/react-realworld /usr/src/app/
RUN npm install
CMD ["npm", "start"]

# Building backend
FROM node:latest AS node-realworld-backend
WORKDIR /app
RUN git clone git@github.com:ditsmod/realworld.git backend/node-realworld
COPY backend/node-realworld /app
RUN yarn install
RUN yarn boot
CMD ["yarn", "start"]