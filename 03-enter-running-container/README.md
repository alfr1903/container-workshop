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
container. In
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
hardcoded recipe that is _very_ generic.

Lets adapt our frontend to tell us the truth!

### Task 3.1 - Find the Source Code

First you need to run the following command to get into the
interactive shell of the running container:

```bash
docker exec -it <container_id/conainer_name> sh
```

Type `ls` to get some overview. You should see the following contents:

- **node_modules/**
- package-lock.json
- package.json
- **public/**
- **src/**
- tsconfig.json

The heading `Your Name's Magic CookBook` is located in `App.tsx`, can
you display it's content in the interactive shell terminal?

<details>
<summary>✅ Solution 3.1</summary>

After opening the shell, type `cd src` where `App.tsx` exists.
Type `ls` to ensure it. Type `cat App.tsx` to see the content.

</details>

### Task 3.2 - Edit the Source Code

Before editing the source code try aligning your browser with the
application running next to the interactive terminal of the container.
By doing so you will see the change made to the source code
immediately.

For editing the content you might use a text editor such as `nano`
or `vim`.

```sh
nano App.tsx
vim App.tsx
```

Getting an error that your shell cannot find either `nano` or `vim`?
🤔 This is because the container does not posses these programs. We
will need to download by running one of the following:

```sh
apk add nano
apk add vim
```

Now try running the above command again.

> _NB: If you have not used
> nano/vim before be careful when typing:_
>
>- _If using nano: make sure to follow the instructions on the bottom
   > of the terminal first._
>- _If using vim: first click `i` to enter interactive mode and `esc`
   > when finished._
>
>_To quit the editor type `:wq` (short for write quit) if you wish to
> save and `q` or `:q!` (short for quit) if you wish to abort the
editing._

Use the arrows to navigate to the line where the heading is set (
🤫line 46) and change it to whatever you find soothing. Save the file
and you should see the updates in your running application in the
browser. Cool?