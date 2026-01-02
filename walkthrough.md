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
I have configured the build to output to the `docs/` folder, which is the standard way to deploy from the main branch on GitHub Pages. I also added a `.nojekyll` file to prevent build errors.

1.  **Build the Demo**:
    ```bash
    npm run build:demo
    ```
    This creates a `docs` folder with the website assets.

2.  **Push to GitHub**:
    Commit and push the `docs/` folder to your main branch.

3.  **Configure GitHub Pages**:
    - Go to your repository **Settings** > **Pages**.
    - Under **Build and deployment** -> **Source**, select **Deploy from a branch**.
    - For **Branch**, select `main` (or `master`) and folder `/docs`.
    - Click **Save**.

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
