let currentCategoryIndex = 0;
let currentIndex = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;
let startTime = 0;

const cardElement = document.getElementById('flashcard');
const innerCard = cardElement.querySelector('.flashcard-inner');
const questionText = document.getElementById('question');
const answerText = document.getElementById('answer');
const cardNumber = document.getElementById('card-number');
const categoriesTabs = document.getElementById('categories-tabs');
const categoryKeys = Object.keys(flashcardsCategories);

function init() {
    categoriesTabs.innerHTML = "";
    categoryKeys.forEach((name, i) => {
        const btn = document.createElement('div');
        btn.className = 'category-tab';
        btn.innerText = name;
        btn.id = `tab-${i}`;
        btn.onclick = (e) => { 
            e.stopPropagation();
            currentCategoryIndex = i; 
            currentIndex = 0; 
            renderCard(); 
        };
        categoriesTabs.appendChild(btn);
    });
    renderCard();
}

function renderCard() {
    const currentCards = flashcardsCategories[categoryKeys[currentCategoryIndex]];
    
    // Reset totale della carta
    cardElement.classList.remove('is-flipped');
    innerCard.style.transition = "none"; 
    innerCard.style.transform = "translateX(0) rotateY(0)";
    innerCard.style.opacity = "1";
    
    // Aggiorna testi
    questionText.innerText = currentCards[currentIndex].q;
    answerText.innerText = currentCards[currentIndex].a;
    cardNumber.innerText = currentIndex + 1;

    // UI Tabs
    document.querySelectorAll('.category-tab').forEach((t, i) => {
        t.classList.toggle('active', i === currentCategoryIndex);
    });

    const activeTab = document.getElementById(`tab-${currentCategoryIndex}`);
    if (activeTab) activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center' });
}

// --- GESTIONE TOUCH OTTIMIZZATA ---

cardElement.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startTime = Date.now();
    isDragging = true;
    currentX = 0;
    innerCard.style.transition = "none"; // Rimuove transizioni durante il movimento del dito
}, {passive: true});

cardElement.addEventListener('touchmove', e => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX - startX;
    
    // Se stiamo trascinando, non permettiamo la rotazione 3D per non incasinare il motore grafico
    if (!cardElement.classList.contains('is-flipped')) {
        const rotation = currentX / 15;
        innerCard.style.transform = `translateX(${currentX}px) rotate(${rotation}deg)`;
    }
}, {passive: true});

cardElement.addEventListener('touchend', e => {
    if (!isDragging) return;
    isDragging = false;
    
    const duration = Date.now() - startTime;
    const absX = Math.abs(currentX);

    // LOGICA CLICK: Se il movimento è minimo e il tocco è breve, gira la carta
    if (absX < 10 && duration < 250) {
        flipCard();
        return;
    }

    // LOGICA SWIPE: Se superiamo la soglia, cambia card
    const threshold = 100;
    innerCard.style.transition = "transform 0.3s ease-out, opacity 0.3s";

    if (currentX > threshold) {
        animateOut("100%");
    } else if (currentX < -threshold) {
        animateOut("-100%");
    } else {
        // Torna al centro se lo swipe è incompleto
        innerCard.style.transform = cardElement.classList.contains('is-flipped') ? "rotateY(180deg)" : "translateX(0) rotate(0)";
    }
});

function flipCard() {
    cardElement.classList.toggle('is-flipped');
}

function animateOut(direction) {
    innerCard.style.transform = `translateX(${direction}) rotate(${direction === "100%" ? 20 : -20}deg)`;
    innerCard.style.opacity = "0";
    setTimeout(() => {
        navigate(direction === "100%" ? 'prev' : 'next');
    }, 300);
}

function navigate(direction) {
    const currentCards = flashcardsCategories[categoryKeys[currentCategoryIndex]];
    if (direction === 'next') {
        if (currentIndex < currentCards.length - 1) currentIndex++;
        else {
            currentCategoryIndex = (currentCategoryIndex + 1) % categoryKeys.length;
            currentIndex = 0;
        }
    } else {
        if (currentIndex > 0) currentIndex--;
        else {
            currentCategoryIndex = (currentCategoryIndex - 1 + categoryKeys.length) % categoryKeys.length;
            currentIndex = flashcardsCategories[categoryKeys[currentCategoryIndex]].length - 1;
        }
    }
    renderCard();
}

// Bottoni legacy
function nextCard() { animateOut("-100%"); }
function prevCard() { animateOut("100%"); }

window.onload = init;
