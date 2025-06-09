# Code.IsaiArt

A collection of small web-based coding tools hosted at [code.isaiart.com](https://code.isaiart.com). Each tool is a standalone HTML page designed to run entirely in the browser.

## Available Tools

- **Code Editor** – simple in‑browser editor using CodeMirror
- **Code Combiner** – merge multiple snippets into one file
- **Code Separator** – split a block of code into sections
- **Code Editor V2** – experimental redesign of the editor
- **Mobile Coding** – touch friendly HTML editor
- **Favicon Generator** – create emoji based favicons

Open [index.html](./index.html) to see the landing page with links to each tool.

## Running Locally

These pages are static HTML. To test locally you can run a web server from the repository root:

```bash
python3 -m http.server
```

Then navigate to `http://localhost:8000` in your browser.

## Repository Layout

- `index.html` – landing page listing all tools
- `editor/`, `editor2/`, `mobile/` – various HTML editors
- `separator/` – code separator
- `combiner/` – code combiner
- `favicon/` – favicon generator
- `mobiletest/` – React based prototype (not deployed)
- `oldeditor/` – legacy editor page
- `CNAME` – domain configuration for GitHub Pages

## About

The content of this repository powers the static site at [code.isaiart.com](https://code.isaiart.com). It is maintained as part of the IsaiArt project.
