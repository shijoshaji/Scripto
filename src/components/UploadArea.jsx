import React, { useState, useRef } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';

/**
 * UploadArea Component
 * Handles file selection, drag & drop, and URL fetching.
 * @param {Object} props
 * @param {Function} props.onFileLoaded - Callback ({ name, content })
 */
const UploadArea = ({ onFileLoaded }) => {
    const fileInputRef = useRef(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    // File Handling
    const handleFiles = (files) => {
        if (files.length > 0) {
            const file = files[0];
            if (validateFile(file)) {
                readFile(file);
            } else {
                alert('Please upload a valid Markdown (.md) file.');
            }
        }
    };

    const validateFile = (file) => {
        return file.name.endsWith('.md') || file.name.endsWith('.markdown') || file.type === 'text/markdown';
    };

    const readFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            onFileLoaded({ name: file.name, content: e.target.result });
        };
        reader.readAsText(file);
    };

    // Drag & Drop
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragActive(true);
        } else if (e.type === 'dragleave' || e.type === 'drop') {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    // URL Handling
    const handleUrlSubmit = async () => {
        const trimmedUrl = url.trim();
        if (!trimmedUrl) return;

        setLoading(true);
        try {
            const convertibleUrl = convertToRawUrl(trimmedUrl);
            const response = await fetch(convertibleUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text();
            let filename = trimmedUrl.substring(trimmedUrl.lastIndexOf('/') + 1) || 'remote-file.md';
            if (filename.includes('?')) filename = filename.split('?')[0];

            onFileLoaded({ name: filename, content: text });
        } catch (err) {
            console.error('Fetch error:', err);
            alert('Failed to load Markdown from URL. \n\nNote: This might be due to CORS restrictions. Try a raw GitHub URL.');
        } finally {
            setLoading(false);
        }
    };

    const convertToRawUrl = (url) => {
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname === 'github.com' && url.includes('/blob/')) {
                return url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
            }
        } catch (e) { }
        return url;
    };

    return (
        <section
            className={`upload-zone ${isDragActive ? 'drag-active' : ''}`}
            onClick={() => fileInputRef.current.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            id="upload-area"
        >
            <input
                type="file"
                ref={fileInputRef}
                accept=".md,.markdown"
                hidden
                onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="upload-content">
                <div className="icon-wrapper">
                    <IoCloudUploadOutline />
                </div>
                <h2>Drop your Markdown file here</h2>
                <p>or <span className="browse-btn">browse files</span></p>

                <div className="divider"><span>OR</span></div>

                <div className="url-input-container" onClick={(e) => e.stopPropagation()}>
                    <input
                        type="url"
                        id="url-input"
                        placeholder="Paste a raw Markdown URL..."
                        spellCheck="false"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                    />
                    <button id="url-btn" onClick={handleUrlSubmit} disabled={loading}>
                        {loading ? '...' : 'Go'}
                    </button>
                </div>

                <p className="sub-text">Supports <span style={{ color: 'aqua' }}>.md</span> and <span style={{ color: 'aqua' }}>.markdown</span></p>
            </div>
        </section>
    );
};

export default UploadArea;
