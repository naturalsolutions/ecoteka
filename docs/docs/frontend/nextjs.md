# Next.js

![Next.js](../assets/img/nextjs-hero.png)

---

**Documentation**: <a href="https://nextjs.org/docs/getting-started" target="_blank">https://nextjs.org/docs/getting-started</a>

**Source Code**: <a href="https://github.com/vercel/next.js" target="_blank">https://github.com/vercel/next.js</a>

---

To build a complete web application with React from scratch, there are many important details you need to consider:

- Code has to be bundled using a bundler like webpack and transformed using a compiler like Babel.
- You need to do production optimizations such as code splitting.
- You might want to statically pre-render some pages for performance and SEO. You might also want to use server-side rendering or client-side rendering.
- You might have to write some server-side code to connect your React app to your data store.

A framework can solve these problems. But such a framework must have the right level of abstraction — otherwise it won’t be very useful. It also needs to have great "Developer Experience", ensuring you and your team have an amazing experience while writing code.

## Pages

In Next.js, a page is a React Component exported from a .js, .jsx, .ts, or .tsx file in the pages directory. Each page is associated with a route based on its file name.

If you create pages/about.js that exports a React component like below, it will be accessible at /about.

```typescript
{!../../docs_src/frontend/pages/imports.tsx!}
```

## Custom `App`

## Custom `Document`

## Absolute Imports and Module path aliases

=== "Before"

    ```typescript
    import ETKComponent from "../../.../components/ETKComponent"
    ```

=== "After"

    ```typescript
    import ETKComponent from "@/components/ETKComponent"
    ```

```json hl_lines="16-20"
{!../../docs_src/frontend/tsconfig.json!}
```

## Custom Error Page

### 404 Page

### 500 Page
