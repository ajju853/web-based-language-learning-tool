const form = document.getElementById('flashcard-form');
const flashcardContainer = document.getElementById('flashcard-container');
const reviewSection = document.getElementById('review-section');
const quizSection = document.getElementById('quiz-section');
const quizWord = document.getElementById('quiz-word');
const quizAnswer = document.getElementById('quiz-answer');
const feedback = document.getElementById('feedback');
let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
let currentFlashcardIndex = 0;


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);


function createFlashcard(frontText, backText) {
    const geometry = new THREE.BoxGeometry(1, 1.5, 0.05);
    const frontMaterial = new THREE.MeshBasicMaterial({ color: 0x61dafb });
    const backMaterial = new THREE.MeshBasicMaterial({ color: 0x282c34 });
    const flashcard = new THREE.Mesh(geometry, [frontMaterial, backMaterial]);

    const frontCanvas = document.createElement('canvas');
    const frontContext = frontCanvas.getContext('2d');
    frontCanvas.width = 256;
    frontCanvas.height = 256;
    frontContext.fillStyle = '#61dafb';
    frontContext.fillRect(0, 0, frontCanvas.width, frontCanvas.height);
    frontContext.fillStyle = '#000';
    frontContext.font = '20px Arial';
    frontContext.fillText(frontText, 10, 128);
    const frontTexture = new THREE.Texture(frontCanvas);
    frontTexture.needsUpdate = true;
    frontMaterial.map = frontTexture;

    const backCanvas = document.createElement('canvas');
    const backContext = backCanvas.getContext('2d');
    backCanvas.width = 256;
    backCanvas.height = 256;
    backContext.fillStyle = '#282c34';
    backContext.fillRect(0, 0, backCanvas.width, backCanvas.height);
    backContext.fillStyle = '#fff';
    backContext.font = '20px Arial';
    backContext.fillText(backText, 10, 128);
    const backTexture = new THREE.Texture(backCanvas);
    backTexture.needsUpdate = true;
    backMaterial.map = backTexture;

    return flashcard;
}

function renderFlashcards() {
    flashcardContainer.innerHTML = '';
    scene.clear(); 
    flashcards.forEach((card, index) => {
        const flashcard = createFlashcard(card.front, card.back);
        flashcard.position.set(index * 1.5 - (flashcards.length - 1) * 0.75, 0, 0);
        flashcard.rotation.y = Math.PI; 
        scene.add(flashcard);
    });
    camera.position.z = 5;
}

document.getElementById('create-flashcards').addEventListener('click', () => {
    reviewSection.classList.add('hidden');
    quizSection.classList.add('hidden');
    document.getElementById('flashcard-creation').classList.remove('hidden');
});

document.getElementById('review-flashcards').addEventListener('click', () => {
    document.getElementById('flashcard-creation').classList.add('hidden');
    quizSection.classList.add('hidden');
    reviewSection.classList.remove('hidden');
    renderFlashcards();
});

document.getElementById('quiz-yourself').addEventListener('click', () => {
    document.getElementById('flashcard-creation').classList.add('hidden');
    reviewSection.classList.add('hidden');
    quizSection.classList.remove('hidden');
    startQuiz();
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const front = document.getElementById('front').value;
    const back = document.getElementById('back').value;
    const flashcard = { front, back };
    flashcards.push(flashcard);
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    form.reset();
});

function startQuiz() {
    currentFlashcardIndex = Math.floor(Math.random() * flashcards.length);
    quizWord.textContent = flashcards[currentFlashcardIndex].front;
    feedback.textContent = '';
}

document.getElementById('submit-answer').addEventListener('click', () => {
    const userAnswer = quizAnswer.value;
    const correctAnswer = flashcards[currentFlashcardIndex].back;
    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        feedback.textContent = 'Correct!';
        feedback.className = 'correct';
    } else {
        feedback.textContent = `Incorrect! The correct answer is: ${correctAnswer}`;
        feedback.className = 'incorrect';
    }
    quizAnswer.value = '';
    startQuiz();
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

renderFlashcards();