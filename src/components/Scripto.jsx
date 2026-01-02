import React, { useState, useEffect } from 'react';
import { IoMoonOutline, IoSunnyOutline, IoDocumentTextOutline, IoArrowUpOutline } from 'react-icons/io5';
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

    // Initial Theme Logic
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
        document.documentElement.setAttribute('data-theme', initialTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    // Scroll to Top Logic
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFileLoaded = (data) => {
        setFileData(data);
        window.scrollTo(0, 0);
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
        <>
            <div className="background-blobs">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>

            <button id="theme-toggle" aria-label="Toggle Theme" onClick={toggleTheme}>
                {theme === 'light' ? <IoSunnyOutline /> : <IoMoonOutline />}
            </button>

            <main className="app-container">
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
                    <p>🎯 App created by <a href="https://bio.link/shijoshaji" target="_blank" rel="noopener noreferrer">Shijo Shaji</a></p>
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
        </>
    );
};

export default Scripto;
