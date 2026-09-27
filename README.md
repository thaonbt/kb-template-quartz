# kb-template-quartz

Digital garden and knowledge base built with [Quartz](https://quartz.jzhao.xyz/).

## Branch policy

This project uses Quartz v5 as the active working branch.

- Default branch: `v5`
- `main`: kept as a legacy/reference branch only
- Active development and sync commands should be run from `v5`

Example:

```bash
git checkout v5
npx quartz sync
git push origin v5
```

If you are deploying from GitHub Pages or another hosting platform, make sure the deployment target is set to the `v5` branch.

## Requirements

- Node.js 22 or newer
- npm 10 or newer

## Installation

```bash
npm install
npx quartz plugin install --from-config
```

## Build and run

There are two separate use cases depending on what content you want to build.

### 1. Build the official Quartz demo (content from `docs/`)

Use this if you want to preview or reproduce the site exactly as shown on the official Quartz demo (quartz.jzhao.xyz). This builds from the `docs/` folder, which ships with the template.

```bash
npm run docs
```

Open [http://localhost:8080/](http://localhost:8080/). The server watches for file changes and rebuilds automatically.

### 2. Build your own notes (content from `content/`)

Use this for day-to-day work on your own notes, written in the `content/` folder.

```bash
npx quartz build --serve
```

Open the local URL printed in the terminal (defaults to `http://localhost:8080/`). This is the command used for actual development on this repo.

### Running both at the same time

`docs/` and `content/` are independent source folders, but both dev servers default to the same output folder (`public/`) and the same WebSocket port (`3001`) — running two `--serve` instances without overriding these will make them silently overwrite each other's output. To preview both side by side, give each instance its own output folder, port, and WebSocket port:

```bash
# Terminal 1 — your own notes, output to ./public
npx quartz build --serve --output public

# Terminal 2 — the official demo, separate output folder and ports
npx quartz build --serve -d docs --output public-docs --port 8081 --wsPort 3002
```

Make sure both output folders (`public/` and `public-docs/`) are listed in `.gitignore`.

## Run in Codespaces

Run either command above in the Codespace terminal, then open port `8080` from the **Ports** panel in VS Code. The public URL has this format:

```text
https://[codespace-id]-8080.app.github.dev/
```

## Deploy to GitHub Pages

The workflow in `.github/workflows/main.yml` deploys automatically when changes are pushed to the `v5` branch.

```bash
git add .
git commit -m "Update notes"
git push origin v5
```

GitHub Actions will install dependencies, install Quartz plugins, build the site, and publish the `public/` directory.

Published site:

[https://thaonbt.github.io/kb-template-quartz/](https://thaonbt.github.io/kb-template-quartz/)

## Useful commands

| Command                                   | Purpose                                                |
| ------------------------------------------ | --------------------------------------------------------- |
| `npx quartz plugin install --from-config` | Install all plugins referenced in `quartz.config.yaml` |
| `npm run docs`                            | Build and serve the official Quartz demo (`docs/`) on port 8080 |
| `npx quartz build --serve`                | Build and serve your own notes (`content/`)            |
| `npm run check`                           | Run TypeScript and formatting checks                   |
| `npm test`                                | Run the test suite                                     |

## FAQ

**Does running `npm run docs` overwrite or delete my own notes?**

No. `docs/` and `content/` are separate source folders — building from one never reads or writes the other. Both commands only write their output to `public/`, which is listed in `.gitignore` and is never committed. If you build the demo and later want your own site back, just run `npx quartz build --serve` again — it rebuilds `public/` from `content/` from scratch. Nothing needs to be manually reset or restored.