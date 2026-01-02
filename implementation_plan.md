# Enable GitHub Pages Deployment

## Goal Description
Configure the project to build a deployable demo version of the `react-scripto` library so it can be hosted on GitHub Pages.

## Problem
The current `vite.config.js` is configured for **Library Mode**. It builds a JavaScript package for NPM, not a website. It excludes `index.html` and externalizes `react`.

## Proposed Changes

### [NEW] [vite.demo.config.js](file:///d:/Skill%20Devlopment/IT/GitHub_Public_Repo/Scripto/vite.demo.config.js)
Create a separate Vite configuration for the demo app.
- **Entry**: Uses `index.html` (implicit default).
- **OutDir**: `dist-demo` (to separate from library `dist`).
- **Base**: `/Scripto/` (Correct base path for GitHub Pages project repositories).

### [MODIFY] [package.json](file:///d:/Skill%20Devlopment/IT/GitHub_Public_Repo/Scripto/package.json)
Add scripts for building and deploying the demo.
- `build:demo`: `vite build -c vite.demo.config.js`
- `deploy`: (Optional) `gh-pages -d dist-demo` (if user wants to use `gh-pages` package, otherwise just manual upload).

## Verification Plan
1. Run `npm run build:demo`.
2. check `dist-demo` contains `index.html` and assets.
3. User can then deploy `dist-demo` to GitHub Pages.
