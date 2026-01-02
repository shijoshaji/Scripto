# Scripto React Library Conversion Walkthrough

I have successfully converted the vanilla JavaScript Scripto application into a React component library `react-scripto` using Vite Library Mode. I have also configured a demo build for GitHub Pages.

## Changes
- **Project Structure**: Initialized a Vite project.
- **Refactoring**: Ported `app.js` and `index.html` logic into React components in `src/components/`.
    - `Scripto.jsx`: Main container and theme manager.
    - `UploadArea.jsx`: Drag & drop and URL input.
    - `PreviewArea.jsx`: Markdown rendering, copy, speech, and PDF export.
    - `markdownLogger.js`: Utility for safe markdown parsing.
- **Styling**: Moved `style.css` to `src/style.css` and added font imports for standalone usage.
- **Build**: Configured `vite.config.js` to output a library bundle (`dist/scripto.js` and `dist/scripto.umd.cjs`).

## GitHub Pages Deployment
To deploy a demo version of Scripto to GitHub Pages:

1.  **Build the Demo**:
    ```bash
    npm run build:demo
    ```
    This creates a `dist-demo` folder with the website assets.

2.  **Deploy**:
    - **Option A (Manual)**: Upload the contents of `dist-demo` to your GitHub repository's `gh-pages` branch (or configure Pages to serve from `/docs` if you move the files there).
    - **Option B (gh-pages package)**:
        1. Install: `npm install gh-pages --save-dev`
        2. Add script to `package.json`: `"deploy": "gh-pages -d dist-demo"`
        3. Run: `npm run deploy`

    > **Note**: I have set the base path to `/Scripto/` in `vite.demo.config.js`. If your repo name is different, update the `base` property in that file.

## Usage (Library)
To use the library in another React project:
```bash
npm install react-scripto
```
(Once published or linked locally)

```jsx
import { Scripto } from 'react-scripto';
import 'react-scripto/dist/style.css'; // If not automatically injected

function App() {
  return <Scripto />;
}
```
