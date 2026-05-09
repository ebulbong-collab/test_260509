// main.js
const URL = 'https://teachablemachine.withgoogle.com/models/7dfbnmdRX/';

let model, webcam, labelContainer, maxPredictions;
let isWebcamRunning = false;

const webcamBtn = document.getElementById('webcam-btn');
const fileUpload = document.getElementById('file-upload');
const imagePreview = document.getElementById('image-preview');
const resultContainer = document.getElementById('result-container');
const labelContainerEl = document.getElementById('label-container');
const placeholderText = document.getElementById('placeholder-text');
const resetBtn = document.getElementById('reset-btn');
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
    themeBtn.textContent = theme === 'dark' ? '라이트 모드' : '다크 모드';
}

// Load the image model
async function loadModel() {
    if (!model) {
        const modelURL = URL + 'model.json';
        const metadataURL = URL + 'metadata.json';
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    }
}

// Webcam setup
async function setupWebcam() {
    await loadModel();
    const flip = true;
    webcam = new tmImage.Webcam(400, 400, flip);
    await webcam.setup();
    await webcam.play();
    isWebcamRunning = true;
    webcamBtn.textContent = '⏹ 카메라 중지';
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
        webcamBtn.textContent = '📸 카메라 시작';
        document.getElementById('webcam-container').innerHTML = '';
        placeholderText.style.display = 'block';
    }
}

webcamBtn.addEventListener('click', () => {
    if (isWebcamRunning) {
        stopWebcam();
    } else {
        setupWebcam();
    }
});

// File Upload
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
        
        // Wait for image to load before predicting
        imagePreview.onload = async () => {
            await predict(imagePreview);
        };
    };
    reader.readAsDataURL(file);
});

// Prediction logic
async function predict(element) {
    const prediction = await model.predict(element);
    resultContainer.style.display = 'block';
    labelContainerEl.innerHTML = '';

    // Sort by probability
    prediction.sort((a, b) => b.probability - a.probability);

    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0);
        
        const barContainer = document.createElement('div');
        barContainer.className = 'prediction-bar-container';
        
        barContainer.innerHTML = `
            <div class="prediction-label">
                <span>${className}</span>
                <span>${probability}%</span>
            </div>
            <div class="bar-bg">
                <div class="bar-fill" style="width: ${probability}%"></div>
            </div>
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
