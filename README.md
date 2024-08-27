# position-app

This project is a template for creating your positioning web application/game.

This project uses the following frameworks and libraries:

1. [SvelteKit](https://kit.svelte.dev/docs/introduction): framework
2. [TailwindCSS](https://tailwindcss.com/): CSS but (much) easier to use
3. [DaisyUI](https://daisyui.com/): UI library based on TailwindCSS
4. [Svelte-Geolocation](https://github.com/metonym/svelte-geolocation): Geolocation API wrapper for Svelte
5. [Svelte-MapLibre](https://github.com/dimfeld/svelte-maplibre): MapLibre wrapper for Svelte

This project was created using [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Before use

1. This project uses JavaScript with type checking **disabled** to avoid excessive type engineering. This, however, leaves the application vulnerable to type-related errors. If you are a serious web developer, consider enabling JSDoc or using TypeScript for type checking.
2. Most of the information you will need for development can be found in the documentations of the involved libraries linked above.
3. Eslint is enabled by default, which will perform syntax and format checking. To take advantage of automatic formatting, use VSCode.
4. Lines with the comment `\\ DoNotChange` should not be modified, unless you know what you are doing.
5. In some browsers, getting the current location can be quite slow or forbidden. Firefox seems to be the most stable.
6. Altitude and accuracy information from the Geolocation API is only available on mobile devices. On computers, only the longitude and latitude are available.

## Prerequisites

1. Install `git` and set it up with your GitHub account.
2. Install the latest VSCode with at least the following plugins:
   1. ESLint
   2. Svelte for VS Code
   3. Tailwind CSS IntelliSense
3. Install the latest `node.js` and `pnpm`
   - If you understand the differences, you are free to replace `pnpm` with another package manager. Make sure to also replace `pnpm` in the commands below.
   - It is NOT recommended to modify the versions of the installed packages. If you are prompted by the package manager to upgrade old or "deprecated" packages, ignore.

## Developing

1. Fork this repository to your own GitHub account, **DO NOT** change the repository name `position-app`.

2. Clone the repository to your machine.

    ```bash
    git clone git@github.com:<your_username>/position-app.git
    ```

3. In the project folder, install dependencies:

    ```bash
    pnpm install
    ```

4. Start a development server:

    ```bash
    pnpm run dev
    ```

5. After modifying and validating code changes, add, commit and push to your remote repository:

    ```bash
    git add .
    git commit -m "commit message"
    git push
    ```

## Deploying

1. Build project:

    ```bash
    pnpm run build
    ```

2. Deploy project to GitHub pages:

    ```bash
    pnpm run deploy
    ```

3. Only after the first deployment, go to the repository settings on GitHub, then to the Pages tab. Select the `gh-pages` branch as the publishing source and click on Save.
4. Your web application will be available at _https://<your_username>.github.io/position-app/_ **after a few minutes**.
