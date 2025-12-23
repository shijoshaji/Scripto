// app.js

const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const browseBtn = document.querySelector('.browse-btn');
const previewArea = document.getElementById('preview-area');
const markdownContent = document.getElementById('markdown-content');
const filenameDisplay = document.getElementById('filename-display');
const closeBtn = document.getElementById('close-btn');
const themeToggle = document.getElementById('theme-toggle');

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

// Reset speech when app resets
const originalReset = resetApp;
resetApp = function () {
    stopSpeaking();
    originalReset(); // Call the original reset function (needs refactoring if original is const)
};

// Refactor resetApp to be let (workaround for this snippet approach)
// Better approach: merge reset logic directly in the existing resetApp function if possible,
// but since I'm appending, I'll just override the previous resetApp logic manually in the full file rewrite or careful edit. 
// Actually, let's just create a `stopSpeaking()` call inside the usage of resetApp or simply update resetApp in this block? 
// The safest is to just modify resetApp in place if I can find it. 
// For now, I'll manually call stopSpeaking in the existing resetApp by replacing it in the next step or redefining it here if it's a function declaration.

// Since resetApp is defined as `function resetApp()`, it is hoisted. 
// I can't easily wrap it without recursion if I keep the name.
// I will just add an event listener for close button to stop speaking as well.
closeBtn.addEventListener('click', stopSpeaking);

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
closeBtn.addEventListener('click', resetApp);


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
