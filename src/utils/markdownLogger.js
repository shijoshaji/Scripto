import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Robust Custom Renderer for Anchor Links
const renderer = {
    heading(text, level, raw) {
        // Compatibility check: newer marked versions might pass an object as first arg
        if (typeof text === 'object' && text !== null) {
            raw = text.raw || raw;
            level = text.depth || text.level || level;
            text = text.text || '';
        }

        // Use 'raw' content if available for cleaner IDs, else text
        const source = raw || String(text);

        const id = source
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        return `<h${level} id="${id}">${text}</h${level}>`;
    }
};

marked.use({ renderer });

export function renderMarkdown(markdown) {
    // Sanitize and Parse (Allow IDs for anchor links)
    const rawHtml = marked.parse(markdown);

    // Configure DOMPurify to explicitly allow 'id' attributes on headings
    const html = DOMPurify.sanitize(rawHtml, {
        ADD_ATTR: ['id', 'name'], // 'name' sometimes used for anchors too
        ADD_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] // Ensure headers aren't stripped (redundant but safe)
    });

    return html;
}
