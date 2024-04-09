# Next workshop

This is course dedicated to teaching fundamentals of NextJS, a framework for creating SSR websites based on React. By leveraging ChatGPT, the website is able to suggest recipes and ingredients for whatever a client might ask for.

Check out the [step-by-step guide](step-by-step.md) to get started with the development.

## Introduction

The app is created via the command `npx create-next-app@latest` (14.1.0 as of writing).

`npx` is a command for executing `npm` package binaries. This command is most associated for setting up boilerplate code for new projects. Almost all files in the `next-workshop` folder is created with this command.

`create-next-app@latest` describes the binary executed in order to create necessary files such as `package.json`, `app/layout.tsx`, and `app/page.tsx`.

## To run the project

1. Navigate your terminal to this directory (`next-workshop`).
2. Ensure that all packages are installed with the following command:

```bash
> npm install # or the shorthand 'npm i'
```

3. Run the project in development mode using the following command:

```bash
> npm run dev
```

4. With your browser, go to the link provided after running the previous command (most likely [http://localhost:3000](http://localhost:3000)).

Start changing the `.tsx` files to see changes on the website. Visit the [step-by-step guide](step-by-step.md) for instructions.
