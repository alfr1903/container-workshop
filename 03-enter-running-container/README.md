# Enter a Running Container

If you took a ride on the fair waters with the final task, task 1.5,
in the first session, [Docker Desktop](/01-docker-desktop), you
encountered a new command: `docker exec`. See the following two
examples of usage:

```bash
docker exec <container_name/id> ls
docker exec -it <container_name/id> bash
```

`docker exec` enables you to execute another process within the
container (the -it flag makes it 'interactive' so that you can write in the created shell). In
the first case, a simple `ls` (listing files and directories) is
executed and
the output returned. In the second one an interactive shell process is
started. When inside the interactive shell you can manipulate the file
system of the running container as if it was your own local machine!

## 🫵🏽 Try it out yourself

As you might notice, if being of the observant kind, your _magic
cookbook_ is actually not so magic anymore 🥹 This is because we
changed the backend to being a mocked version of the openAI. The
response you are getting from the backend is nothing more than a
hardcoded recipe.

Lets adapt our frontend to tell us the truth!

### Task 3.1 - Find the Source Code

First you need to run the following command to get into the
interactive shell of the running container:

```bash
docker exec -it <container_id/container_name> sh
```

Type `ls` to get some overview. You should see the following contents:

- **app/**
- next-env.d.ts
- **node_modules/**
- package-lock.json
- package.json
- tsconfig.json

The Title text value `TechCollEDGE cookbook` is located in `app/page.tsx`, can
you display it's content in the interactive shell terminal?

<details>
<summary>✅ Solution 3.1</summary>

After opening the shell, type `cd app` where `page.tsx` exists.
Type `ls` to ensure it. Type `cat page.tsx` to see the content.

</details>

### Task 3.2 - Edit the Source Code

For editing the content you might use a text editor such as `nano`
or `vim`.

```sh
nano page.tsx
vim page.tsx
```

Getting an error that your shell cannot find either `nano` or `vim`?
🤔 This is because you have chosen a base image in your Dockerfile's `FROM` statement that doesn't come with these programs. To install one of them, you can run either of these commands inside this interactive shell:

```sh
apk add nano
apk add vim
```

Now try running the above command again.

> _NB: If you have not used
> nano/vim before be careful when typing:_
>
> - _If using nano: make sure to follow the instructions on the bottom
>   of the terminal first._
> - _If using vim: first click `i` to enter interactive mode and `esc`
>   when finished._
>
> _To quit the editor type `:wq` (short for write quit) if you wish to
> save and `q` or `:q!` (short for quit) if you wish to abort the
> editing._

Use the arrows to navigate to the line where the Title text value is set (
🤫line 17) and change it to whatever you find fitting.

### Task 3.3 - Rebuild the application

#### 3.3.1 Simple

After changing the file, you might have noticed that nothing changes on the website. This is because we are running the `npm build` and `npm start` commands, instead of `npm run dev`. If you look inside the package.json file, you can see that these commands point to Next commands, where the `next build` command builds a compact and efficient version of the product, and `npm start` runs that build. This is what is meant for actually deploying an application for use.

If you want your changes to be deployed to the container, you will have to build the image again, kill the running container and make a new one based on the new image.

<details>
<summary>✅ Solution 3.3.1 Simple</summary>

You just need to run the same commands as earlier to delete the image and container:

```bash
docker stop next-frontend-container
docker rm next-frontend-container
docker rmi next-frontend-image
```

And run the same commands as earlier to recreate them and run them:

```bash
docker build -t next-frontend-image .
docker run -d --name next-frontend-container next-frontend-image:latest
```

</details>

#### 3.3.2 Advanced

This can be a tedious process, even if you don't use docker, so obviously this is not something we usually do during development.

`npm run dev` runs a "bloated" version of the application, which means it will simply run your files as they are and include all the dependencies listed under "devDependencies". This often includes different tools you would use as a developer, which aren't necessary in a production environment, and will usually also be more "verbose", which means tools and processes will log more information in the terminal about what is happening.

One common feature of dev scripts is hot-reloading, which is what keeps updating the webpage as you make changes. To make any project hot-reloadable, you'll need to find a tool that keeps watch of your files and forces a reload, like nodemon (usually for node but can work with other files too) and integrate them into your `npm run dev` script. Thankfully, the `next dev` command comes pre-packaged with hot-reloading, so we can just use the `npm run dev` already built into the project.

Now, we don't want to change our dockerfile to run `npm run dev`. It's important to have a dockerfile for production. Instead, we can make a new file, `Dockerfile.dev`(the names of dockerfiles are arbitrary, but this is the common practice), and use the `-f <filename>` argument to specify which dockerfile to use when we build an image (you might want to name this image and the container something different, like adding '-dev' to the names).

Create this new dockerfile and try to get a container up and running that will hot-reload when you do changes like you did in vim or nano earlier!

<details>
<summary>✅ Solution 3.3.2 Advanced</summary>
Simply copy the other dockerfile, rename it something like 'Dockerfile.dev', remove the `npm build` command, and replace `npm start` with `npm run dev`!.
</details>

#### 3.3.2 Pro 🔥

You might have noticed that this still isn't really that useful. You still have to use vim or node in a terminal to make changes, and those changes won't persist into the next time you build an image!

Preferably we'd want to be able to make changes in VS code as normal, and see the changes live in the docker container. Is there a concept you've learnt earlier in this course that might be useful in this situation?

<details>
<summary>Hint</summary>
Volumes
</details>

<details>
<summary>✅ Solution 3.3.2 Pro</summary>
The solution to this depends what you want to only copy once, and what you want to constantly update, but the simplest dockerfile.dev would be:

```dockerfile
# ==== CONFIGURE =====
# Use a Node base image using version 20-alpine
FROM node:20-alpine

# Set the working directory to /app inside the container
WORKDIR /app

# Start the app with the same command as you used locally
CMD npm run dev
```

`npm i` isn't necessary, as you've already ran npm i in your local filesystem, and the volume will copy over the node_modules folder. All `COPY` commands are removed as the volume will copy over these files as well. `npm build` is removed and `npm start` is replaced with `npm run dev` to use hot-reloading.

Then build the image:
`docker build -t next-frontend-dev .`

and run the container like this,

`docker run -d -p 3000:5050 --name next-frontend-dev -v ./:/app next-frontend-dev`

where the `-v ./:/app next-frontend-dev` links the ./ (aka whatever folder you are currently in) to the /app folder inside the container.

This will update any files into the docker container. This also means that any time a file changes inside the docker container, it will follow into your host filesystem. This is useful for many things, like keeping a persistent database, give several docker containers access to the same files, or like we just did by updating the container with the newest files so we can have hot-reloading while still working in Docker.

Now, copying over the entire directory might a bit overkill, especially since the hot-reload in `next dev` doesn't check for changes in the config files anyways, so in this usecase it might be useful to `COPY` the config files over as we did in the normal docker file, and only mount the files that you know you will change often like the app directory like this:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json", "tsconfig.json", "./"]

RUN npm i

CMD npm run dev
```

with the run command
`docker run -d -p 3000:5050 --name next-frontend-dev -v ./app:/app/app next-frontend-dev`

</details>
