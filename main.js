// main.js
const numberSpans = document.querySelectorAll('.number');
const generateBtn = document.querySelector('.btn');

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
