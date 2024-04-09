## What is Next?

Next is a Javascript framework for creating server-side rendered (SSR) websites based on React (another Javascript framework). If you visit a website that uses SSR, you will receive a "finished" website, so all your browser needs to do is to parse the HTML document(s).

When opening a <i>regular</i> React website, the server returns Javascript, which the browser needs to interpret in order to build the website. Sites like these tend to be somewhat less performant during the initial load than websites rendered on the server. SSR websites tend to require more processing power on the server, since the server needs to do more work each time the website is requested.

There are pros and cons to both approaches. However, SSR has become the de facto standard for creating website that aim to have a high reach, due to improved Search Engine Optimization (SEO). This is a metric which checks how well search engines are able to index a certain website. For non-SSR websites, the search engines have a hard time evaluating the content of the a page, since a DOM is not fully rendered on load. What the search engine sees, is just Javascript.

## Reactivity

Now that the project is running, you can make changes to the code, which will hot reload the website.

### Intro to reactivity

An important concept in React (and by inheritance, Next), is reactivity. The word reactivity in this context refers to response to change, and reactivity can be triggered by events like user input, changing the size of a browser window, API calls, etc.

In React, several `hooks` exist, which help in creating reactive behavior. The two most commonly used are `useState` and `useEffect`.

#### The `useState` hook

```jsx
/* app/page.tsx */

'use client';

import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('Your name');

  return (
    <div>
      <h1>My name is {name === '' ? 'unknown' : name}</h1>
      <input
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}
```

As can be seen, the `useState` function takes a parameter, which we have set to the string `'Your name'`. Next infers the type based on what you enter to this function, and returns one variable (`name`), and one function (`setName`). These are used to display and change the state respectively.

<details>
<summary>The "use client" directive</summary>

Note the `'use client'` directive placed at the top of the file. This directive tells Next that the component needs to be rendered at the client, not the server. This directive is necessary when using hooks that depend on user input, such as `useState`.

</details>

#### The `useEffect` hook

The `useEffect` hook is used when you want to execute code as a response to changes.

```jsx
/* app/page.tsx */

'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [name, setName] = useState('Your name');
  const [reverseName, setReverseName] = useState('eman ruoY');

  useEffect(() => {
    setReverseName(() => name.split('').reverse().join(''));
  }, [name]);

  return (
    <div>
      <h1>My name is {name === '' ? 'unknown' : name}</h1>
      <h1>
        My name backwards is {reverseName === '' ? 'nwonknu' : reverseName}
      </h1>
      <input
        type='text'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}
```

As can be seen in the example, the `useEffect` includes a callback function, in which `setReverseName` is called. It simply reverses the `name` variable and assigns it to `reverseName`. You can also see an array after the callback function, which includes the `name` variable. This means that _that_ particular `useEffect` function is only called when the `name` variable is changed.

In conjunction, the `useState` and `useEffect` hooks can be utilized to create highly adaptable and feature rich applications.

## Components

Components are an integral part of web development when using Javascript frameworks. They are reusable pieces of code meant to reduce duplicate code and simplify development. If you are going to show an article on several subpages, there is no need to create all the HTML for all subpages. As an example, see how one can implement a navigation bar component below.

```jsx
/* app/components/NavigationBar.tsx */

import Link from 'next/link';

interface NavigationItem {
  title: string;
  url: string;
}

interface NavigationBarProps {
  links: Array<NavigationItem>;
}

export default function NavigationBar({ links }: NavigationBarProps) {
  return (
    <div>
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.url}
        >
          {link.title}
        </Link>
      ))}
    </div>
  );
}
```

If you take a look at the following line:

```jsx
export default function NavigationBar({ links }: NavigationBarProps)
```

You can see that the component takes `links` as a parameter. The `links` type (`NavigationBarProps`) is defined further up in the file. Parameters in components are called `props`, and mainly function as one-way bindings that you pass from a parent component to a child component. This means that you can't change the value of props in the child component, and that they have to be changed by the parent component. You can use functions like `onChange` to signal the parent to make changes to the props, which will then propagate downwards again, creating a two-way binding.

This component can then be used by any other component/page like this:

```jsx
/* app/page.tsx */

import NavigationBar from './components/NavigationBar';

export default function Home() {
  const links = [
    { title: 'Home', url: '/home' },
    { title: 'About', url: '/about' },
    { title: 'Sign in', url: '/sign-in' },
  ];
  return (
    <div>
      <NavigationBar links={links}></NavigationBar>
    </div>
  );
}
```

In `NavigationBar.tsx`, the `Link` elements are custom NextJS components, meaning we have a page containing a `NavigationBar` component, which in turn contains several `Link` components.
