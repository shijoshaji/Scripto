import React, { useEffect, useState, useRef } from 'react';
import {
    IoVolumeHighOutline,
    IoStopCircleOutline,
    IoCopyOutline,
    IoDownloadOutline,
    IoCloseOutline,
    IoCheckmarkOutline
} from 'react-icons/io5';
import { renderMarkdown } from '../utils/markdownLogger';

const PreviewArea = ({ content, filename, onClose }) => {
    const [htmlContent, setHtmlContent] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        if (content) {
            const sanitizedHtml = renderMarkdown(content);
            setHtmlContent(sanitizedHtml);
        }
    }, [content]);

    // Force anchor link navigation
    useEffect(() => {
        const handleAnchorClick = (e) => {
            const targetId = e.target.getAttribute('href')?.substring(1);
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        };

        const links = document.querySelectorAll('.markdown-body a[href^="#"]');
        links.forEach(link => link.addEventListener('click', handleAnchorClick));

        return () => {
            links.forEach(link => link.removeEventListener('click', handleAnchorClick));
        };
    }, [htmlContent]);

    // Speech Logic
    const toggleSpeech = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            const text = document.getElementById('markdown-content')?.innerText;
            if (!text) return;

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1;
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        }
    };

    useEffect(() => {
        return () => window.speechSynthesis.cancel();
    }, []);

    // Copy Logic
    const handleCopy = () => {
        const element = document.getElementById('markdown-content');
        if (!element) return;

        const text = element.innerText;
        const html = element.innerHTML;

        const blobHtml = new Blob([html], { type: 'text/html' });
        const blobText = new Blob([text], { type: 'text/plain' });

        const data = [new ClipboardItem({
            'text/html': blobHtml,
            'text/plain': blobText,
        })];

        navigator.clipboard.write(data)
            .then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            })
            .catch(() => {
                // Fallback
                navigator.clipboard.writeText(text).then(() => {
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                });
            });
    };

    // PDF Logic
    const handlePdf = () => {
        alert("💡 Tip: To preserve the visual theme in your PDF, make sure to check 'Background graphics' in the print settings window.");
        window.print();
    };

    return (
        <section className="preview-zone">
            <div className="preview-header">
                <span id="filename-display">{filename || 'filename.md'}</span>
                <div className="header-actions">
                    <button
                        className={`icon-btn ${isSpeaking ? 'speaking' : ''}`}
                        onClick={toggleSpeech}
                        title={isSpeaking ? "Stop Reading" : "Read Aloud"}
                    >
                        {isSpeaking ? <IoStopCircleOutline /> : <IoVolumeHighOutline />}
                    </button>
                    <button
                        className="icon-btn"
                        onClick={handleCopy}
                        title="Copy to Clipboard"
                        style={{ color: copySuccess ? 'var(--accent-color)' : '' }}
                    >
                        {copySuccess ? <IoCheckmarkOutline /> : <IoCopyOutline />}
                    </button>
                    <button className="icon-btn" onClick={handlePdf} title="Save as PDF">
                        <IoDownloadOutline />
                    </button>
                    <button className="icon-btn" onClick={onClose} title="Close File" id="close-btn">
                        <IoCloseOutline />
                    </button>
                </div>
            </div>
            <div
                id="markdown-content"
                className="markdown-body"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
        </section>
    );
};

export default PreviewArea;
