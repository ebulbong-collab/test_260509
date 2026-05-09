// main.js
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
    '강아지': '귀엽고 친근한 인상의 강아지상입니다! 다정한 성격과 활발한 에너지가 매력포인트네요. 주변 사람들에게 긍정적인 에너지를 주는 타입입니다.',
    '고양이': '세련되고 도도한 매력의 고양이상입니다! 신비로운 분위기와 날카로운 직관력을 가지고 계시네요. 처음엔 차가워 보일 수 있지만 알수록 따뜻한 매력이 있습니다.',
    '토끼': '사랑스럽고 깜찍한 토끼상입니다! 보호본능을 자극하는 맑은 눈망울과 밝은 미소가 특징이네요. 누구에게나 사랑받는 친화력을 가지고 있습니다.',
    '공룡': '개성 넘치고 강렬한 카리스마의 공룡상입니다! 뚜렷한 이목구비와 시원시원한 마스크가 매력적이네요. 트렌디하고 세련된 느낌을 주는 타입입니다.',
    '곰': '듬직하고 편안한 인상의 곰상입니다! 포근한 분위기와 신뢰감을 주는 눈빛이 매력적이네요. 주변 사람들에게 안정감을 주는 든든한 타입입니다.'
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
    themeBtn.textContent = theme === 'dark' ? '라이트 모드' : '다크 모드';
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
    resultDescription.textContent = descriptions[topResult] || '당신만의 특별한 동물상을 가지고 계시네요!';

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
