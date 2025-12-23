# Scriptō - Elegant Markdown Viewer

**Scriptō** is a beautiful, lightweight, and offline-capable Markdown viewer designed for simplicity and elegance. It runs entirely in your browser with no backend required.

> "Simple, elegant visualization — where every mark becomes meaning."

## ✨ Features

### 📂 **Instant Preview**
- **Drag & Drop**: Simply drop any `.md` or `.markdown` file to view it instantly.
- **File Picker**: Browse files from your local system.

### 🔗 **Remote Fetching**
- **URL Support**: Load Markdown files directly from the web.
- **Smart GitHub Support**: Automatically converts standard GitHub file URLs (blob) to raw format for seamless viewing.
- **Query Params**: Share links easily using `?url=YOUR_LINK` (e.g., `index.html?url=https://raw.github...`).

### 🎨 **Visual Experience**
- **Glassmorphism Design**: Modern, translucent UI with vibrant background animations.
- **Theme Toggle**: Switch between the default **Cosmic Dark** mode and a clean **Pastel Light** mode.
- **Responsive**: Perfectly optimized for desktops, tablets, and mobile devices.

### 🔊 **Accessibility**
- **Read Aloud**: Integrated Text-to-Speech engine reads your document out loud.
- **Visual Feedback**: Pulse animation indicates when audio is playing.

## 🚀 How to Use

### Local Usage
1.  Download the repository.
2.  Double-click `index.html` to open it in your browser.
3.  **Note**: Some browsers might restrict URL fetching (CORS) when running from `file://`. For full features, run a simple local server:
    ```bash
    # Python 3
    python -m http.server 8000
    ```

### Hosting (GitHub Pages)
This app is "Static-Ready". You can deploy it directly to GitHub Pages, Vercel, or Netlify with zero configuration.

## 🛠️ Tech Stack
- **Core**: HTML5, Vanilla CSS3, Vanilla JavaScript (ES6+).
- **Libraries** (via CDN):
    - [Marked.js](https://marked.js.org/) (Markdown Parser)
    - [DOMPurify](https://github.com/cure53/DOMPurify) (Security/Sanitization)
    - [Ionicons](https://ionic.io/ionicons) (Icons)
- **Fonts**: [Outfit](https://fonts.google.com/specimen/Outfit) (Google Fonts).

## 👨‍💻 Credits
Created by [Shijo Shaji](https://bio.link/shijoshaji).

---
*MIT License*
