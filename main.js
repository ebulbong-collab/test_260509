// main.js
const menuDisplay = document.getElementById('recommended-menu');
const generateBtn = document.getElementById('generate-btn');
const themeBtn = document.getElementById('theme-btn');

const menus = [
    '김치찌개', '된장찌개', '제육볶음', '돈까스', '초밥', 
    '치킨', '피자', '삼겹살', '마라탕', '쌀국수', 
    '파스타', '스테이크', '햄버거', '떡볶이', '짜장면', 
    '짬뽕', '탕수육', '샤브샤브', '부대찌개', '보쌈'
];

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
    themeBtn.textContent = theme === 'dark' ? '라이트 모드' : '다크 모드';
}

// Menu recommendation logic
function suggestMenu() {
    menuDisplay.classList.add('fade-out');
    
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * menus.length);
        menuDisplay.textContent = menus[randomIndex];
        menuDisplay.classList.remove('fade-out');
    }, 300);
}

generateBtn.addEventListener('click', suggestMenu);
