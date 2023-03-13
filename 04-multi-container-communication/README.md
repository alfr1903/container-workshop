# Multi Container Communication

By nature containers are isolated and know nothing about whatever is
going on outside of their four walls. It is only Docker Engine, who
has
been instructed to set up the port mapping, who have enabled
communication between the container and your local machine. However
Docker Engine has done you a small favor and setting up a default
bridge network which all containers is added to by default. This
default bridge network allows your containers to communicate by using
their IP addresses.

## 🫵🏽 Try it out yourself

Up until now we have been running the frontend in a docker container
and the backend locally. How about containerizing the backend as well?

Create a new dockerfile preferably in the root folder of the
react-workshop project. However, as long as your are concious of path
references you can place it where ever. _NB: if placing the dockerfile
in the same folder as the dockerfile for the frontend you will need to
name it with a prefix, e.g. `backend.dockerfile` and then run
the `docker build`command with an additional `-f` flag that specifies
the filename of the dockerfile_. Copy the following content to the
dockerfile and make sure the paths are matching.

```dockerfile
# ==== DOCKERFILE FOR BACKEND =====
# Use a Node 16 base image
FROM node:16-alpine
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY backend .
# Change workdir to backend folder
WORKDIR /app/backend
# ==== BUILD =====
# Install dependencies
RUN npm install
# ==== RUN =======
# Start the app
CMD [ "npm", "start" ]
```

Then you may run the container with the following command:

```bash
docker run -d -p 5050:5050 --name react-workshop-backend react-workshop-backend:latest 
```

#### **Disclaimer**

Unfortunately, we will not be able to run the application in browser
when containerizing both the frontend and the backend. This is due to
some strict policy connected to CORS (Cross Origin Site Access) 💔

### Task 4.1 - Confirm Connectivity in Default Bridge Network

As mentioned, Docker Engine automatically creates a default network
for your containers. To confirm it, type `docker network ls`and you
should see a list of containing three networks:

```bash
NETWORK ID     NAME                      DRIVER    SCOPE
cce76153157e   bridge                    bridge    local
2041a6fc784f   host                      host      local
b3e848ccdc5b   none                      null      local
```

The _bridge_ network is the one that allows for cross container
communication, but only by using the containers IP addresses. To
ensure that the connectivity exists, you first need to find the IP
address of the backend container by inspecting it:

```bash
docker inspect react-workshop-backend
```

In the output you should see the IP address next to the `IPAddress`
field.

Next, exec into the frontend container:

```bash
docker exec -it react-workshop-frontend bash
```

Then, install `curl` with apk:

```bash
apk add curl
```

And, curl the backend container:

```bash
curl http://<BACKEND_CONTAINER_IP_ADDRESS>:5050/keepAlive
```

### ✅ Answer 4.1

Did you get a response `Hi frontend`?

### Task 4.2 - Create a Network and Connect Containers

### Task 4.3 - Confirm User-Based Connectivity
