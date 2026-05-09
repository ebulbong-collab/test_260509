// main_en.js
const URL = 'https://teachablemachine.withgoogle.com/models/7dfbnmdRX/';

let model, webcam, maxPredictions;
let isWebcamRunning = false;

const webcamBtn = document.getElementById('webcam-btn');
const fileUpload = document.getElementById('file-upload');
const imagePreview = document.getElementById('image-preview');
const resultContainer = document.getElementById('result-container');
const labelContainerEl = document.getElementById('label-container');
const resultDescription = document.getElementById('result-description');
const placeholderText = document.getElementById('placeholder-text');
const resetBtn = document.getElementById('reset-btn');
const themeBtn = document.getElementById('theme-btn');

const descriptions = {
    '강아지': 'You have a cute and friendly dog-like face! Your warm personality and active energy are your main charms. You are the type who brings positive energy to those around you.',
    '고양이': 'You have a sophisticated and chic cat-like face! You possess a mysterious aura and sharp intuition. You might seem cool at first, but you have a warm charm once people get to know you.',
    '토끼': 'You have a lovely and adorable rabbit-like face! Your clear eyes and bright smile trigger protective instincts. You have a friendly nature that is loved by everyone.',
    '공룡': 'You have an intense and charismatic dinosaur-like face! Your distinct features and clean-cut mask are attractive. You give off a trendy and sophisticated vibe.',
    '곰': 'You have a reliable and comfortable bear-like face! Your cozy aura and trustworthy gaze are charming. You are a dependable person who gives stability to those around you.'
};

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

async function loadModel() {
    if (!model) {
        const modelURL = URL + 'model.json';
        const metadataURL = URL + 'metadata.json';
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    }
}

async function setupWebcam() {
    await loadModel();
    webcam = new tmImage.Webcam(400, 400, true);
    await webcam.setup();
    await webcam.play();
    isWebcamRunning = true;
    webcamBtn.textContent = '⏹ Stop Webcam';
    placeholderText.style.display = 'none';
    imagePreview.style.display = 'none';
    document.getElementById('webcam-container').appendChild(webcam.canvas);
    window.requestAnimationFrame(webcamLoop);
}

async function webcamLoop() {
    if (isWebcamRunning) {
        webcam.update();
        await predict(webcam.canvas);
        window.requestAnimationFrame(webcamLoop);
    }
}

function stopWebcam() {
    if (webcam) {
        webcam.stop();
        isWebcamRunning = false;
        webcamBtn.textContent = '📸 Start Webcam';
        document.getElementById('webcam-container').innerHTML = '';
        placeholderText.style.display = 'block';
    }
}

webcamBtn.addEventListener('click', () => {
    if (isWebcamRunning) stopWebcam(); else setupWebcam();
});

fileUpload.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    stopWebcam();
    await loadModel();
    const reader = new FileReader();
    reader.onload = async (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        placeholderText.style.display = 'none';
        imagePreview.onload = async () => { await predict(imagePreview); };
    };
    reader.readAsDataURL(file);
});

async function predict(element) {
    const prediction = await model.predict(element);
    resultContainer.style.display = 'block';
    labelContainerEl.innerHTML = '';
    prediction.sort((a, b) => b.probability - a.probability);

    const topResult = prediction[0].className;
    resultDescription.textContent = descriptions[topResult] || 'You have your own unique animal face type!';

    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0);
        const barContainer = document.createElement('div');
        barContainer.className = 'prediction-bar-container';
        barContainer.innerHTML = `
            <div class="prediction-label"><span>${className}</span><span>${probability}%</span></div>
            <div class="bar-bg"><div class="bar-fill" style="width: ${probability}%"></div></div>
        `;
        labelContainerEl.appendChild(barContainer);
    }
}

resetBtn.addEventListener('click', () => {
    stopWebcam();
    imagePreview.style.display = 'none';
    resultContainer.style.display = 'none';
    placeholderText.style.display = 'block';
    fileUpload.value = '';
});
