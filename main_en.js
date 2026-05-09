// main_en.js
const menuDisplay = document.getElementById('recommended-menu');
const generateBtn = document.getElementById('generate-btn');
const themeBtn = document.getElementById('theme-btn');

const menus = [
    'Kimchi Stew', 'Soybean Paste Stew', 'Stir-fried Pork', 'Pork Cutlet', 'Sushi', 
    'Fried Chicken', 'Pizza', 'Grilled Pork Belly', 'Malatang', 'Pho', 
    'Pasta', 'Steak', 'Hamburger', 'Tteokbokki', 'Jajangmyeon', 
    'Jjamppong', 'Tangsu-yuk', 'Shabu-shabu', 'Budae-jjigae', 'Bossam'
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
    themeBtn.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
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
