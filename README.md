# Scriptō - React Markdown Viewer

[**🚀 Live Demo**](https://shijoshaji.github.io/Scripto/) | [**📦 NPM Package**](https://www.npmjs.com/package/@jojovms/scripto)

**Scriptō** is a beautiful, lightweight, and simple Markdown viewer component for React.

> "Simple, elegant visualization — where every mark becomes meaning."

## ✨ Features

- **Beautiful UI**: Modern, glassmorphism design with vibrant background animations.
- **Instant Preview**: Drag & drop or paste URLs to view `.md` files instantly.
- **Rich Text Copy**: Copy Markdown as formatted HTML to paste directly into emails/docs.
- **Accessibility**: Integrated Text-to-Speech (Read Aloud).
- **Export**: Save documents as clean PDF files.
- **Theming**: Built-in Dark and Light modes.

## 📦 Installation

```bash
npm install @jojovms/scripto
```

## 🚀 Usage

Import the component and the styles in your React application:

```jsx
import React from 'react';
import { Scripto } from '@jojovms/scripto';
import '@jojovms/scripto/dist/style.css'; // Don't forget the styles!

function App() {
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      {/* Basic Usage */}
      <Scripto />

      {/* Or load a file from a URL */}
      <Scripto url={`${window.location.origin}/docs/walkthrough.md`} />
      or
      <Scripto url="https://raw.githubusercontent.com/jojovms/scripto/main/README.md" />
    </div>
  );
}

export default App;
```

> **Note**: The `Scripto` component is designed to take up the full height of its container. Ensure the parent container has a defined height (e.g., `100vh`).

## 🛠️ Props

| Prop | Type | Description |
|------|------|-------------|
| `url` | `string` | Optional. A direct URL to a Markdown file to load on mount. Supports raw URLs or GitHub blob URLs. |

## 👨‍💻 Credits

Created by [Shijo Shaji](https://bio.link/shijoshaji).

---
*MIT License*
