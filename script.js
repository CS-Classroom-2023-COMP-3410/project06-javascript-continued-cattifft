const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const difficultySelect = document.getElementById('difficulty');
const textDisplay = document.getElementById('text-display');
const inputBox = document.getElementById('input-box');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');

let textToType = '';
let startTime = null;
let correctChars = 0;
let totalChars = 0;
let isTyping = false;
let isZenMode = false;

// Generate random text based on difficulty
function generateText(difficulty) {
    const easyText = "The quick brown fox jumps over the lazy dog.";
    const mediumText = "Typing is an essential skill in the modern digital world.";
    const hardText = "Complex sentences with punctuation and numbers: 123, testing!";

    switch (difficulty) {
        case 'easy': return easyText;
        case 'medium': return mediumText;
        case 'hard': return hardText;
        case 'zen': return ''; // Zen mode has no predefined text
        default: return easyText;
    }
}

// Highlight input accuracy in real-time
function updateDisplay() {
    const input = inputBox.value;
    correctChars = 0;

    const displayHTML = [...textToType].map((char, i) => {
        if (i < input.length) {
            if (char === input[i]) {
                correctChars++;
                return `<span class="correct">${char}</span>`;
            } else {
                return `<span class="incorrect">${char}</span>`;
            }
        } else {
            return char;
        }
    }).join('');

    textDisplay.innerHTML = displayHTML;

    // Update WPM and accuracy while typing
    if (isTyping) {
        calculateMetrics();
    }
}

// Calculate WPM and accuracy
function calculateMetrics() {
    const elapsedTime = (Date.now() - startTime) / 1000 / 60; // Time in minutes
    const wpm = Math.round((correctChars / 5) / elapsedTime); // 5 chars = 1 word
    const accuracy = Math.round((correctChars / totalChars) * 100);

    wpmDisplay.textContent = isNaN(wpm) ? 0 : wpm;
    accuracyDisplay.textContent = isNaN(accuracy) ? 0 : accuracy;
}

// Show results for Zen Mode
function finishZenMode() {
    isTyping = false;
    const elapsedTime = (Date.now() - startTime) / 1000; // Total time in seconds
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = Math.floor(elapsedTime % 60);

    const totalTyped = inputBox.value.length;
    const wpm = Math.round((totalTyped / 5) / (elapsedTime / 60));

    textDisplay.innerHTML = `
        <h3>Zen Mode Summary</h3>
        <p><strong>Time:</strong> ${minutes}:${seconds.toString().padStart(2, '0')}</p>
        <p><strong>WPM:</strong> ${isNaN(wpm) ? 0 : wpm}</p>
        <p><strong>Total Characters Typed:</strong> ${totalTyped}</p>
        <p><strong>Typed Text:</strong></p>
        <div>${inputBox.value}</div>
    `;
    inputBox.disabled = true;
    restartBtn.style.display = 'block';
}

// Display detailed results summary
function showResultsSummary() {
    const elapsedTime = (Date.now() - startTime) / 1000; // Total time in seconds
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = Math.floor(elapsedTime % 60);

    const accuracy = Math.round((correctChars / totalChars) * 100);
    const wpm = Math.round((correctChars / 5) / (elapsedTime / 60));

    textDisplay.innerHTML = `
        <h3>Results Summary</h3>
        <p><strong>Time:</strong> ${minutes}:${seconds.toString().padStart(2, '0')}</p>
        <p><strong>WPM:</strong> ${isNaN(wpm) ? 0 : wpm}</p>
        <p><strong>Accuracy:</strong> ${isNaN(accuracy) ? 0 : accuracy}%</p>
        <p><strong>Text Typed:</strong></p>
        <div>${textToType}</div>
    `;
    inputBox.disabled = true;
    restartBtn.style.display = 'block';
}

// Start the typing session
function startTyping() {
    textToType = generateText(difficultySelect.value);
    isZenMode = difficultySelect.value === 'zen';

    textDisplay.innerHTML = isZenMode ? "Start typing freely..." : textToType;
    inputBox.value = '';
    inputBox.disabled = false;
    inputBox.focus();
    correctChars = 0;
    totalChars = textToType.length;
    startTime = Date.now();
    isTyping = true;
    restartBtn.style.display = 'none';

    inputBox.addEventListener('input', () => {
        if (!isZenMode) {
            updateDisplay();
            if (inputBox.value === textToType) {
                isTyping = false;
                showResultsSummary();
            }
        }
    });

    if (isZenMode) {
        inputBox.addEventListener('keydown', (event) => {
            if (event.shiftKey && event.key === 'Enter') {
                event.preventDefault();
                finishZenMode();
            }
        });
    }
}

// Restart the typing session
function restartTyping() {
    inputBox.disabled = true;
    startTyping();
}

// Event Listeners
startBtn.addEventListener('click', startTyping);
restartBtn.addEventListener('click', restartTyping);

const darkModeToggle = document.getElementById('dark-mode-toggle');

// Check localStorage for dark mode preference
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️ Light Mode';
}

// Toggle dark mode
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        darkModeToggle.textContent = '☀️ Light Mode';
    } else {
        localStorage.setItem('darkMode', 'disabled');
        darkModeToggle.textContent = '🌙 Dark Mode';
    }
});

