# Multi Container Communication

By nature containers are isolated and know nothing about whatever is
going on outside of their four walls. It is only Docker Engine, who
has
been instructed to set up the port mapping, who have enabled
communication between the container and your local machine. However
Docker Engine has done you a small favor and set up a default
bridge network which all containers is added to by default. This
default bridge network allows your containers to communicate by using
their IP addresses.

## 🫵🏽 Try it out yourself

Up until now we have been running the frontend in a docker container
and the backend locally. How about containerizing the backend as well?

Create a new dockerfile preferably in the root folder of the
react-workshop project. However, as long as your are conscious of path
references you can place it where ever.

> _NB: if placing the dockerfile
> in the same folder as the dockerfile for the frontend you will need
to
> name it with a prefix, e.g. `backend.dockerfile` and then run
> the `docker build`command with an additional `-f` flag that
specifies
> the filename of the dockerfile_.

Copy the following content to the
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

Create an image for the backend:

```bash
# If the backend dockerfile is located separately from the frontend dockerfile
docker build -t workshop-backend-image <path_to_backend_dockerfile>

# If the backend dockerfile is located in the same level as the frontend dockerfile
docker build -t workshop-backend-image -f backend.dockerfile <path_to_backend_dockerfile>
```

Then you may run the container with the following command:

```bash
docker run -d -p 8000:8000 --name workshop-backend-container workshop-backend-image:latest 
```

#### **Disclaimer**

Unfortunately, we will not be able to run the application in browser
when containerizing both the frontend and the backend. This is due to
some strict policy possibly connected to CORS (Cross Origin Site
Access) 💔

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
docker inspect workshop-backend-container
```

In the output you should see the IP address next to the `IPAddress`
field.

Next, exec into the frontend container:

```bash
docker exec -it react-frontend-container sh
```

At this point we could simply `ping` the other backend container, but
then we would only know that we have reached the container, but not if
we can speak to the api running inside it. To illustrate that we can
reach the port where the api runs we need to `curl` the endpoint
instead. Curl is not a default package included in the alpine image,
hence we need to install `curl` with apk:

```bash
apk add curl
```

And, curl the backend container:

```bash
curl http://<BACKEND_CONTAINER_IP_ADDRESS>:8000/checkLiveness
```

<details>
<summary>✅ Solution 4.1</summary>

Did you get a response saying `Hi frontend 👋`?

</details>

### Task 4.2 - Create a Network and Connect Containers

This is a fully adequate approach of achieving communication between
containers, but it might not be the most neet way? Wouldn't it be
better if we could just refer to the containers by their container
names which we assigned to them when running them, i.e. _
react-frontend-container_ and _workshop-backend-container_? Well, you
guessed it - that is exactly what we can do.

While still inside the frontend container shell, type the above
command again, but instead of using the IP-address you swap that part
with the name of the backend container:

```bash
curl http://workshop-backend-container:8000/checkLiveness
```

No connection? 🤔This is because the frontend container know nothing
about the other more than the IP address of other containers by
default. In order to make this work we first
need to make a virtual network:

```bash
docker network create -d bridge container-workshop-network
```

Inspect the network to see that there are no containers in this
network - `containers` field is empty:

```bash
docker inspect container-workshop-network
```

Then, connect the containers to the network:

```bash
# Connect frontend
docker network connect container-workshop-network react-frontend-container

# connect backend
docker network connect container-workshop-network workshop-backend-container
```

Inspect the network again - can you find the newly added containers?

```bash
docker inspect container-workshop-network
```

<details>
<summary>✅ Solution 4.2</summary>

When inspecting the network after connecting the containers you should
get an output similar to this:

```bash
...,
"Containers": {
            "e94c870a95368926b7324ae59e7ec16f58a367443f84c56abdfd8ba341189bf1": {
                "Name": "workshop-backend-container",
                "EndpointID": "bef8c0c026739c9ece53ceead8ae0b1a25d5b2094c6256f3995904750ae2aa9c",
                "MacAddress": "02:42:ac:14:00:03",
                "IPv4Address": "172.20.0.3/16",
                "IPv6Address": ""
            },
            "f3b030a96e0fbfcb8c57116e9243e68e3e7bcb92c94a344d65230d51c0a99c03": {
                "Name": "react-frontend-container",
                "EndpointID": "09147b9e632d8b90a35ecbdff710289d4ddd8dd30aec085b936323ce4a8bef3c",
                "MacAddress": "02:42:ac:14:00:02",
                "IPv4Address": "172.20.0.2/16",
                "IPv6Address": ""
            }
        },
        ...,
```

</details>

### Task 4.3 - Confirm User-Based Connectivity

Let's try the `curl` command from the previous task and see if we have
connection now:

```bash
curl http://workshop-backend-container:8000/checkLiveness
```

If you receive the `Hi frontend 👋` response again, you have
established
the connection.

You have also finished a container workshop and can now call yourself
a certified (_by Netlights definition_) application containerizator 🥳
