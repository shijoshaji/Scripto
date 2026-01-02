import React, { useState, useEffect } from 'react';
import { IoMoonOutline, IoSunnyOutline, IoDocumentTextOutline, IoArrowUpOutline } from 'react-icons/io5';
import { FaNpm } from 'react-icons/fa';
import UploadArea from './UploadArea';
import PreviewArea from './PreviewArea';
import '../style.css';

/**
 * Scripto Main Component
 */
const Scripto = () => {
    const [theme, setTheme] = useState('light'); // Default to light or check system
    const [fileData, setFileData] = useState(null); // { name, content }
    const [showScrollTop, setShowScrollTop] = useState(false);
    const scrollContainerRef = React.useRef(null);

    // Initial Theme Logic
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
        // Removed global document 'data-theme' setting for library safety
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // Scroll to Top Logic
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (container.scrollTop > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleFileLoaded = (data) => {
        setFileData(data);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    };

    const handleClose = () => {
        setFileData(null);
        const url = new URL(window.location);
        url.searchParams.delete('url');
        window.history.pushState({}, '', url);
    };

    // Handle URL param on load
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const remoteUrl = params.get('url');
        // Logic for auto-loading from URL can be added here if needed
    }, []);

    return (
        <div className="scripto-wrapper" data-theme={theme}>
            <div className="background-blobs">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>

            <button id="theme-toggle" aria-label="Toggle Theme" onClick={toggleTheme}>
                {theme === 'light' ? <IoSunnyOutline /> : <IoMoonOutline />}
            </button>

            <main className="app-container" ref={scrollContainerRef}>
                {/* Header */}
                <header className="glass-header">
                    <div className="logo">
                        <IoDocumentTextOutline />
                        <h1>Scr!p<span>tō</span></h1>
                    </div>
                    <p>“Simple, elegant visualization — where every mark becomes meaning.”</p>
                </header>

                {/* Content */}
                {!fileData ? (
                    <UploadArea onFileLoaded={handleFileLoaded} />
                ) : (
                    <PreviewArea
                        content={fileData.content}
                        filename={fileData.name}
                        onClose={handleClose}
                    />
                )}

                {/* Footer */}
                <footer className="app-footer">
                    <p> Try it out on &nbsp;<a href="https://www.npmjs.com/package/@jojovms/scripto" target="_blank" rel="noopener noreferrer" className="npm-link" title="View on NPM">
                            <FaNpm style={{ fontSize: '2.5em', verticalAlign: 'middle', marginRight: '5px' }} />
                        </a>
                        <span style={{ margin: '0 10px', opacity: 0.5 }}>|</span>
                        🎯 App created by <a href="https://bio.link/shijoshaji" target="_blank" rel="noopener noreferrer">Shijo Shaji</a>
                    </p>
                </footer>
            </main>

            {/* Scroll to Top Button */}
            <button
                id="scroll-top-btn"
                aria-label="Scroll to Top"
                className={showScrollTop ? 'visible' : ''}
                onClick={scrollToTop}
            >
                <IoArrowUpOutline />
            </button>
        </div>
    );
};

export default Scripto;
