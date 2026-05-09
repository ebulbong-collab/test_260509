// main.js
const numberSpans = document.querySelectorAll('.number');
const generateBtn = document.querySelector('.btn');
const themeBtn = document.getElementById('theme-btn');

// Theme logic
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeButtonText(currentTheme);

themeBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    let newTheme = theme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButtonText(newTheme);
});

function updateThemeButtonText(theme) {
    themeBtn.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
}

// Number generation logic
function generateNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    numberSpans.forEach((span, index) => {
        span.textContent = sortedNumbers[index];
    });
}

generateBtn.addEventListener('click', generateNumbers);

// Initial generation
generateNumbers();