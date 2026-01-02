import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: '/Scripto/', // Repo name for GitHub Pages
    build: {
        outDir: 'dist-demo', // Distinct output directory
        emptyOutDir: true,
    },
});
