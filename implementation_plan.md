# Fix GitHub Pages Deployment

## Problem
The deployment failed because GitHub Pages is trying to use Jekyll to build the site, which is incompatible with our Vite build. Additionally, the error logs indicate GitHub Pages is configured to look for a `docs/` folder, but our build outputs to `dist-demo/`.

## Proposed Changes

### [MODIFY] [vite.demo.config.js](file:///d:/Skill%20Devlopment/IT/GitHub_Public_Repo/Scripto/vite.demo.config.js)
- Change `outDir` from `dist-demo` to `docs`.
- This aligns with the common "Deploy from /docs folder" setting in GitHub Pages.

### [NEW] [.nojekyll](file:///d:/Skill%20Devlopment/IT/GitHub_Public_Repo/Scripto/public/.nojekyll)
- Create an empty `.nojekyll` file in the `public` directory.
- This file tells GitHub Pages to **skip** Jekyll processing and serve files as-is.
- Vite will copy this file to the `docs` folder during build.

### [MODIFY] [package.json](file:///d:/Skill%20Devlopment/IT/GitHub_Public_Repo/Scripto/package.json)
- Update `gitignore` to allow `docs/` (if ignored) and ignore `dist-demo`.
- Note: The user commented out `dist-demo` in gitignore already, so we just need to ensure `docs` is allowed (it usually is by default).

## Verification Plan
1.  Run `npm run build:demo`.
2.  Verify `docs/` folder is created and contains `.nojekyll` and `index.html`.
3.  User needs to push these changes to GitHub.
