# Run an Application in a Container

If at any point something is unclear, please refer
to Docker's [Dockerfile
reference](https://docs.docker.com/engine/reference/builder/)
for a more thorough
explanation. Use the _Contents_ on the right side
to navigate to specific
sections or Dockerfile instructions.

Developers _always_ disagree about how to best
write Dockerfiles. To avoid
arguments, try to always follow
Docker's [Best practices for writing
Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
.
Bonus points if you send the link to teammates
that don't.

## What is a Dockerfile?

A dockerfile is a file that describes how the
Docker engine will build an image of your
application. It simply lists some _instructions_
that either is executed by Docker engine while
building the image or that will have effect when
running a container from the image. The file is
often located in the root of the project you are
containerizing, but it can in theory be located
anywhere as long as the references to the file is
taken in account both when writing the content of
the file and when running
the `docker build <path_to_dockerfile>` command.

## Instructions

### `FROM`

`FROM` is used to specify an existing container
image on which you build upon -
the starting point for your image. It is typically
an operating system (e.g
`debian` or `alpine`), a programming language or
collection of build tools (e.g.
`node`, `python`, or some sdk), or some sort of
runtime or program (e.g.
`dotnet` or `nginx`). It may be wise to also
specify a specific tag (e.g.
`python:3.10`) so that the base don't suddenly
change when some third party
pushes a newer image.

```Dockerfile
FROM python:3
```

You may rarely encounter `FROM scratch` in the
wild, which indicates that the
container image is build from scratch - a totally
empty starting point.

### `WORKDIR`

`WORKDIR` sets the working directory within the
file-system of the descending instructions. The
folder will be
created if it does not already exist. If a
relative path is provided (not
starting with `/`), the resulting workdir will be
relative to one previously
specified.

```Dockerfile
WORKDIR /app
```

### `COPY`

`COPY <path_on_local_machine> <path_in_container>`
copies files from your local filesystem
into the container image. Only
files within the _build context_ (a folder
specified on build) may be copied. It
is quite similar to `cp` on unix systems. Both
single files and directories may
be copied, and the target path will automatically
be created if absent. If the
destination is relative (not staring with `/`), it
will be relative to the
`WORKDIR`.

```Dockerfile
# Copy all files within the build context into the working directory of the
# container image
COPY . .

# Copy only the src folder within the build context into src within the root
# of the container filesystem
COPY src /src

# Copy the file index.html into /var/www/html/index.html, even though the
# folder /var/www/html/ does not already exist
COPY html/index.html /var/www/html/index.html
```

### `RUN`

`RUN` runs a command within the shell of the
container being built. It is often
used to update or install packages, and compile or
build the project. Commands
are often written on one line each, with `\` at
the end of all lines but the
last.

```Dockerfile
RUN npm install && \
    npm build
```

### `ENV`

`ENV` is used to define environment variables
within the container. They are
variables that may be used by any process within
the container, such as `PATH`
or `JAVA_HOME`. Note that you may define
additional environment variables when
running a container based on the image.

```Dockerfile
ENV LOG_LEVEL=warning
```

Here, one may override the log level when building
the application, but by
default it is `info`.

### `CMD`

`CMD` is used to specify the command or executable
that runs on container startup.

```Dockerfile
# It can either be run with exec-syntax, like this
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]

# or the equivalent written in shell-syntax:
CMD python3 -m flask run --host=0.0.0.0
```

### `ENTRYPOINT`

Similar to `CMD`. If you want, see [Docker's
description](https://docs.docker.com/engine/reference/builder/#entrypoint)
, as
it is a bit tricky to explain.

## 🫵🏽 Try it out yourself

Remember
the [Next/React workshop](https://github.com/Kpaubert/oslo-tech-colledge/tree/finished-version/next-workshop)
that you may have participated a while back?
Wouldn't it be cool to containerize that?! 🤔Let's
do it!

First, you need to move or copy the folder, _next-workshop_, that you
cloned from the
workshop. Use the following command to do so, but
remember
to change the template-path to the path where you
cloned the repository to. Make sure you
have `container-workshop` as your working
directory or adapt the destination path below.

```bash
# Copy - recommended:
cp <path/to/the/next-workshop/on/your/machine> 02-run-app-in-container

# Or move:
mv <path/to/the/next-workshop/on/your/machine> 02-run-app-in-container
```

Or if you have not participated in the workshop or you were not able
to finish, there is a bare minimum version of the project
in [next-workshop-cheat](next-workshop-cheat) that you can use.

If you are using your own project you might not have access to the API
keys to connect
to openAI so we will exchange the backend with a somewhat simpler
backend. Copy the content of `index.ts` in the react-workshop-cheat
folder and replace it with the
content of your current `index.ts` file located
in `react-workshop/backend`.

```ts
import {Request, Response} from "express";

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
});

app.post('/recipes', async (req: Request, res: Response) => {
    console.info('Received recipe request with request body: ', req.body);
    const ingredients: [string] = req.body.ingredients;
    console.log(ingredients)
    if (!ingredients || ingredients.length < 1) {
        const error = {
            message: "No ingredients provided, aborting request",
        };
        console.error(error.message);
        res.status(400).send(error);
        return;
    }

    console.log("New recipe request! Ingredients: ", ingredients);
    const recipe = {
        "title": "The Recipe 101",
        "description": "This is a recipe that will always work, perfect for everyone!",
        "ingredients": ingredients,
        "steps": [
            "1. Cut all vegetables",
            "2. Slice and spice fish or meat",
            "3. Heat whatever needs to be heated",
            "4. Put on a timer",
            "5. Sit down and wait with whatever you do to chill",
            "6. Put together a fresh salad",
            "7. Put it all together on a plate",
            "8. Enjoy!"
        ],
    }
    res.send(recipe)
});

app.get("/checkLiveness", async (req: Request, res: Response) => {
    console.log("We are live");
    res.send("Hi frontend 👋 \n")
});
```

Before you continue on the tasks make sure that your
application (or
the cheat project) is running locally.

1. Make sure your current working directory
   is `/container-workshop/02-dockerfile/react-workshop`. _Run `pwd`
   if unsure_.
2. Start up the frontend:
    1. `npm install`
    2. `npm start`
3. Open a new terminal window
4. Start up the backend:
    1. `cd backend`
    2. `npm install`
    3. `npm start`
5. Open a web browser and go to `http://localhost:3000` and try to
   fetch some recipes!

### Task 2.1 - Dockerfile and Image

🐳 Time for containerizing the frontend!

Stop the running process in the terminal where you started the
frontend:

On MacOS: `control^ + c`

Open the `dockerfile` located
in `02-run-app-in-container/react-workshop-cheat` and fill
inn the remaining.

> If using your own project you will need to move the `dockerfile`
> there. The root of the project is recommended.

When you have filled in all the instructions, change your working
directory to `02-run-app-in-container/<react_workshop_name>` and run
the following command
to build the image:

```bash
docker build -t react-frontend-image .
```

The `-t` flag provides the image with a _tag_ which is essentially a
name for the image. The `.` in the end describes the path
to where Docker Engine should find the dockerfile to build the image
upon.

To ensure that an image was actually made go to Docker Desktop and you
should find your newly created image under _Images_. Or you may get
equal information by typing the following command in your terminal:

```bash
docker images
```

<details>
<summary>✅ Solution 2.1</summary>

```dockerfile
# ==== DOCKERFILE FOR FRONTEND =====
# Use a Node 16 base image
FROM node:16-alpine
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY src src
COPY public public
COPY [ "package.json", "package-lock.json", "tsconfig.json", "./"]
# ==== BUILD =====
# Install dependencies
RUN npm install
# ==== RUN =======
# Start the app
CMD [ "npm", "start" ]
```

</details>

### Task 2.2 - Run Container

We can now run a new container with the frontend code based on the
docker image we just built. Run the following command to run a
container:

```bash
docker run -d --name react-frontend-container react-frontend-image:latest
```

To ensure that a container was actually made go to Docker Desktop and
you
should find your newly created container under _Containers_. Or you
may get
equal information by typing the following command in your terminal (
adding `-a` lists all not-running containers as well):

```bash
docker ps
docker ps -a
```

You may also see the logs (in realtime by adding the flag `--follow`):

```bash
docker logs react-frontend-container
docker logs react-frontend-container --follow
```

Or you may inspect the containers configurations with the command:

```bash
docker inspect react-frontend-container
```

<details>
<summary>🤫 Want a life hack to show all your friends?</summary>

Instead of entering the name of the container, which in our case is _
react-frontend-container_, we can also use a selection (from the
beginning) of the container ID which is enough for Docker Engine to
distinct the container from other containers running on your machine.

```bash
docker inspect <FIRST_CHAR_OF_CONTAINER_ID>
```

</details>


<details>
<summary>💡 Interested in more details on `docker run` command?</summary>

## Flags

The docker run command has a lot of flags that configure how the
container is
run. These are placed in between `docker run` and the the name of the
image.

E.g. `docker run --rm -it -p 8080:80 -v $PWD/05-*/nginx/html:/usr/share/nginx/html nginx`

### `--rm`

`--rm` may be specified to automatically delete a container once it is
stopped.
Comes in handy when you start a lot of containers you know you will no
longer
need once stopped.

### `-d`

`-d` is short for `--detach`. For long-running containers such as a
web server,
you might want to run the container in the background instead of it
occupying a
terminal.

### `-it`

`-it` is a combination of both `--interactive` and `--tty`. `-t`
essentially
creates a virtual terminal session and `-i` forwards what you write to
the
container. These are most often used together, in the case when you
want to
interact with the container.

Run for example:

```bash
docker run --rm -it ubuntu
```

You are now in a terminal of an ubuntu distribution of Linux and may
play around
without causing harm to you actual system. Such an image may be
extended with a
custom Dockerfile, to create a playground with a lot of tooling
installed - that
may be totally reset at will.

Type `exit` to quit, and destroy (because of `--rm`), the container.

### `-v` and `--workdir`

`-v` is short for `--volume`. In the case with ubuntu above, you may
want to
make files from your own system accessible inside the container. `-v`
lets you
_mount_ an (absolute) path from your host into a path of the
container. By
additionally specifying `--workdir`, that path may be chosen as the
starting
directory.

Run the following:

```bash
docker run --rm -it -v $HOME:/hostuser --workdir /hostuser ubuntu
```

If you now run `ls` inside the container, you should see the content
of your
computers home directory. Use with care though, you can delete stuff
as well.

Sidenote: `docker volume` may be used to create additional volumes
that are
initially empty and may be mounted into one or more containers.

### `-p`

`-p` is short for `--publish` (aka port). It is used to forward a port
on the
local machine to another port of the container. The syntax
is `-p <local
port>:<container port>`.

Run the nginx container and port-forward any local port to `80`
inside the
container. Then open `localhost:` followed by the chosen port in a
browser and
see if you are able to communicate with the container.

Inspect the container logs. If you ran the container with `-it` you
will see
them instantly. If in detached mode (`-d`), use `docker ps`
and `docker logs`.

### `-e`

`-e` is short for `--env`. It is often used to pass the container
secrets that
one does not want to build into the image (e.g `--env KEY=123`).
Environment
values are not yet determined at build time or the values vary between
deployments. It may be the url to the api, that differ in dev and
production, or
the logging format to use.

### `--network` and `--name`

`docker network` is used to create and manage networks. Containers may
be
entered into a network when started, and can then communicate with
other
containers by names rather than IP addresses (e.g. the url to backend
is
`http://backend:3000` because it was started with `--name backend`).

</details>

Open Docker Desktop and see that the container is running. Click on
the container and you should see the following logs:

```bash
2023-03-10 10:53:46 > react-workshop@0.1.0 start
2023-03-10 10:53:46 > react-scripts start
2023-03-10 10:53:46 
2023-03-10 10:53:50 Starting the development server...
2023-03-10 10:53:50 
2023-03-10 10:54:03 Compiled successfully!
2023-03-10 10:54:03 
2023-03-10 10:54:03 You can now view react-workshop in the browser.
2023-03-10 10:54:03 
2023-03-10 10:54:03   Local:            http://localhost:3000
2023-03-10 10:54:03   On Your Network:  http://172.17.0.2:3000
```

### Task 2.3 - Exposing the Container

However, the application will not be reachable
at `http://localhost:3000` 🧐. This is because the container does not
expose a port to your local machine.
Stop and remove the container either in Docker Desktop or in the
terminal:

```bash
docker stop react-frontend-container
docker rm react-frontend-container
```

And run the container again with an additional flag:

```bash
docker run -d -p 3001:3000 --name react-frontend-container react-frontend-image:latest
```

The `-p` flag exposes a port on your local machine and maps it to a
port on the docker container. With the flag values `3001:3000` the
port `3001` on your local machine is mapped to port `3000` on the
container. Go to `http://localhost:3001` and now try to fetch some
recipes.

### Task 2.4 - Injecting ENV Variables in Dockerfile

The default port a react application is running on is port `3000`, but
let's say we need to run the application on port `5050`.

Creating an ENV variable is normally done by running the following
command in
your terminal; `PORT=5050`, before running the `npm start` command to
start the application. However, when doing this with docker we can
inject the ENV variable as an instruction in the dockerfile.

Try to edit the dockerfile to include the ENV variable `PORT=5050`. To
see if it worked stop and remove the running container and remove the
image:

```bash
docker stop react-frontend-container
docker rm react-frontend-container
docker rmi react-frontend-image
```

Rebuild the image:

```bash
docker build -t react-frontend-image .
```

And run a new container:

_NB: do you see what you need to change in the below command for this
to work?_

```bash
docker run -d -p 3001:3000 --name react-frontend-container react-frontend-image:latest
```

<details>
<summary> 🤫Hint</summary>

When you inject the image with an ENV variable that changes the port,
the react application inside the container will now run on the new
port instead of the default port `3000`. In the port mapping described
after the `-p` flag when running the container change the last port
to `5050`.

The full command should be like this:

```bash
docker run -d -p 3001:5050 --name react-frontend-container react-frontend-image:latest
```

</details>

<details>
<summary>✅ Solution 2.4</summary>

```dockerfile
# ==== DOCKERFILE FOR FRONTEND =====
# Use a Node 16 base image
FROM node:16-alpine
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY src src
COPY public public
COPY [ "package.json", "package-lock.json", "tsconfig.json", "./"]
# ==== BUILD =====
# Install dependencies
RUN npm install
ENV PORT=5050
# ==== RUN =======
# Start the app
CMD [ "npm", "start" ]
```

</details>
