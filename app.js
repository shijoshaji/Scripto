// app.js
console.log('App.js v2 loaded');

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const browseBtn = document.querySelector('.browse-btn');
const previewArea = document.getElementById('preview-area');
const markdownContent = document.getElementById('markdown-content');
const filenameDisplay = document.getElementById('filename-display');
const closeBtn = document.getElementById('close-btn');
const themeToggle = document.getElementById('theme-toggle');

// --- Element Safety Check ---
if (!uploadArea || !fileInput || !previewArea || !markdownContent) {
    console.error('Critical elements missing from DOM');
}

// --- Theme Logic ---

function initTheme() {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
        setTheme('light');
    } else {
        setTheme('dark');
    }
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Update Icon
    const icon = themeToggle.querySelector('ion-icon');
    if (theme === 'light') {
        icon.setAttribute('name', 'sunny-outline');
    } else {
        icon.setAttribute('name', 'moon-outline');
    }
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});

// Initialize on load
initTheme();


// --- Text to Speech ---

const speakBtn = document.getElementById('speak-btn');
let speechUtterance = null;
let isSpeaking = false;

if (speakBtn) {
    speakBtn.addEventListener('click', toggleSpeech);
}

function toggleSpeech() {
    if (isSpeaking) {
        stopSpeaking();
    } else {
        startSpeaking();
    }
}

function startSpeaking() {
    const text = markdownContent.innerText; // Get text without HTML tags
    if (!text) return;

    speechUtterance = new SpeechSynthesisUtterance(text);

    // Optional: Configure voice/rate/pitch
    // const voices = window.speechSynthesis.getVoices();
    // speechUtterance.voice = voices[0]; 
    speechUtterance.rate = 1;

    speechUtterance.onend = () => {
        isSpeaking = false;
        updateSpeakIcon(false);
    };

    speechUtterance.onerror = (e) => {
        console.error('Speech error:', e);
        isSpeaking = false;
        updateSpeakIcon(false);
    };

    window.speechSynthesis.speak(speechUtterance);
    isSpeaking = true;
    updateSpeakIcon(true);
}

function stopSpeaking() {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    updateSpeakIcon(false);
}

function updateSpeakIcon(active) {
    const icon = speakBtn.querySelector('ion-icon');
    if (active) {
        icon.setAttribute('name', 'stop-circle-outline');
        speakBtn.setAttribute('title', 'Stop Reading');
        speakBtn.classList.add('speaking');
    } else {
        icon.setAttribute('name', 'volume-high-outline');
        speakBtn.setAttribute('title', 'Read Aloud');
        speakBtn.classList.remove('speaking');
    }
}

// Reset speech when app resets is now handled inside resetApp() directly.

// Click to upload
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', handleFileSelect);

// Drag & Drop
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, () => uploadArea.classList.add('drag-active'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('drag-active'), false);
});

uploadArea.addEventListener('drop', handleDrop, false);

// Close / Reset
if (closeBtn) {
    closeBtn.addEventListener('click', resetApp);
}


// --- New Features (Copy & PDF) ---

document.addEventListener('DOMContentLoaded', () => {
    const copyBtn = document.getElementById('copy-btn');
    const pdfBtn = document.getElementById('pdf-btn');

    if (copyBtn) {
        console.log('Copy button found, adding listener');
        copyBtn.addEventListener('click', handleCopy);
    } else {
        console.warn('Copy button NOT found in DOM');
    }

    if (pdfBtn) {
        console.log('PDF button found, adding listener');
        pdfBtn.addEventListener('click', () => {
            console.log('PDF button clicked');
            alert("💡 Tip: To preserve the visual theme in your PDF, make sure to check 'Background graphics' in the print settings window.");
            window.print();
        });
    } else {
        console.warn('PDF button NOT found in DOM');
    }
});


function handleCopy(e) {
    const text = markdownContent.innerText;
    const html = markdownContent.innerHTML;

    if (!text) return; // Nothing to copy

    const btn = e.currentTarget;

    // Create ClipboardItem with both HTML (for Word/Docs) and Plain Text
    const blobHtml = new Blob([html], { type: 'text/html' });
    const blobText = new Blob([text], { type: 'text/plain' });

    const data = [new ClipboardItem({
        'text/html': blobHtml,
        'text/plain': blobText,
    })];

    navigator.clipboard.write(data).then(() => {
        // Visual Feedback
        const icon = btn.querySelector('ion-icon');

        icon.setAttribute('name', 'checkmark-outline');
        btn.style.color = 'var(--accent-color)';

        setTimeout(() => {
            icon.setAttribute('name', 'copy-outline');
            btn.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy rich text: ', err);
        // Fallback to plain text if HTML copy fails (some browsers might be strict)
        navigator.clipboard.writeText(text).then(() => {
            alert('Rich text copy failed, copied plain text instead.');
        });
    });
}


// --- Handlers ---

// --- URL Fetching Logic ---

const urlInput = document.getElementById('url-input');
const urlBtn = document.getElementById('url-btn');

// Stop click propagation on input/button to prevent triggering the file upload click
urlInput.addEventListener('click', (e) => e.stopPropagation());
urlBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    handleUrlSubmit();
});

// Allow "Enter" key to submit
urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleUrlSubmit();
    }
});

function handleUrlSubmit() {
    const url = urlInput.value.trim();
    if (url) {
        const convertibleUrl = convertToRawUrl(url);
        fetchMarkdown(convertibleUrl);
    }
}

function convertToRawUrl(url) {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'github.com' && url.includes('/blob/')) {
            return url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
        }
    } catch (e) { }
    return url;
}

async function fetchMarkdown(url) {
    try {
        filenameDisplay.textContent = 'Loading...';

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();

        // Basic check to see if it looks like MD or HTML (optional)
        // For now, we trust the user.

        // Extract filename from URL
        let filename = url.substring(url.lastIndexOf('/') + 1) || 'remote-file.md';
        // Remove query params if any
        if (filename.includes('?')) filename = filename.split('?')[0];

        renderMarkdown(text, filename);

    } catch (err) {
        console.error('Fetch error:', err);
        alert('Failed to load Markdown from URL. \n\nNote: This might be due to CORS restrictions (Cross-Origin Resource Sharing) on the target server. Try a raw GitHub URL or a server that allows CORS.');
        filenameDisplay.textContent = '';
    }
}

// Check for ?url= query param on load
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const remoteUrl = params.get('url');

    if (remoteUrl) {
        urlInput.value = remoteUrl;
        fetchMarkdown(remoteUrl);
    }
});


// --- Handlers ---

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    if (files.length > 0) {
        const file = files[0];
        if (validateFile(file)) {
            readFile(file);
        } else {
            alert('Please upload a valid Markdown (.md) file.');
        }
    }
}

function validateFile(file) {
    return file.name.endsWith('.md') || file.name.endsWith('.markdown') || file.type === 'text/markdown';
}

function readFile(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
        const content = e.target.result;
        renderMarkdown(content, file.name);
    };

    reader.readAsText(file);
}

function renderMarkdown(markdown, filename) {
    // Sanitize and Parse
    const html = DOMPurify.sanitize(marked.parse(markdown));

    // Update UI
    markdownContent.innerHTML = html;
    filenameDisplay.textContent = filename;

    // Transition
    uploadArea.classList.add('hidden'); // Or rely on CSS logic if you want to keep dropzone small
    uploadArea.style.display = 'none'; // Simple toggle for now
    previewArea.classList.remove('hidden');
}

function resetApp() {
    stopSpeaking(); // Ensure speech stops on reset
    previewArea.classList.add('hidden');
    uploadArea.style.display = 'block'; // Restore

    // Clean URL params without reloading
    const url = new URL(window.location);
    url.searchParams.delete('url');
    window.history.pushState({}, '', url);

    // Slight delay for animation if we added one, but keeping it simple
    setTimeout(() => {
        markdownContent.innerHTML = '';
        fileInput.value = '';
        urlInput.value = '';
        filenameDisplay.textContent = '';
    }, 100);
}
