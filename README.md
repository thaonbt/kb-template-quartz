# kb-thaonbt-quant-notes

Digital garden and knowledge base built with [Quartz](https://quartz.jzhao.xyz/).

## Requirements

- Node.js 22 or newer
- npm 10 or newer

## Installation

```bash
npm install
npx quartz plugin install
```

## Run locally

Start the development server and build content from the `docs/` directory:

```bash
npm run docs
```

Open [http://localhost:8080/](http://localhost:8080/).

The server watches for file changes and rebuilds the site automatically.

## Run in Codespaces

Run the same command in the Codespace terminal:

```bash
npm run docs
```

Then open port `8080` from the **Ports** panel in VS Code. The public URL has this format:

```text
https://[codespace-id]-8080.app.github.dev/
```

## Build the site

Generate the static site into the `public/` directory:

```bash
npx quartz build -d docs
```

To build and serve the generated site during development, use:

```bash
npm run docs
```

## Deploy to GitHub Pages

The workflow in `.github/workflows/main.yml` deploys automatically when changes are pushed to the `main` branch.

```bash
git add .
git commit -m "Update notes"
git push origin main
```

GitHub Actions will install dependencies, install Quartz plugins, build the site, and publish the `public/` directory.

Published site:

<https://thaonbt.github.io/kb-template-quartz/>

## Useful commands

| Command                    | Purpose                              |
| -------------------------- | ------------------------------------ |
| `npm run docs`             | Build and serve `docs/` on port 8080 |
| `npx quartz build -d docs` | Build the static site into `public/` |
| `npm run check`            | Run TypeScript and formatting checks |
| `npm test`                 | Run the test suite                   |
