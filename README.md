# position-app

This project is a template for creating your positioning web application.

This project uses the following frameworks and libraries:

1. [SvelteKit](https://kit.svelte.dev/docs/introduction)
2. [TailwindCSS](https://tailwindcss.com/)
3. [DaisyUI](https://daisyui.com/)
4. [Svelte-Geolocation](https://github.com/metonym/svelte-geolocation)
5. [Svelte-MapLibre](https://github.com/dimfeld/svelte-maplibre)

This project was created using [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Before use
1. This project uses JavaScript with type checking disabled to avoid excessive type engineering. This, however, leaves the application vulnerable to type-related errors. If you are a serious web developer, consider enabling JSDoc or using TypeScript for type checking.
2. Most of the information you will need for development can be found in the documentations of the involved libraries linked above.
3. Eslint is enabled by default, which will perform syntax and format checking. To take advantage of automatic formatting, use VSCode.

## Developing

Once you've cloned this project and installed dependencies with `pnpm install`, start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

## Deploying

To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
