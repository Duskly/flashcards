let currentCategoryIndex = 0;
let currentIndex = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;

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
        btn.onclick = () => { currentCategoryIndex = i; currentIndex = 0; renderCard(); };
        categoriesTabs.appendChild(btn);
    });
    renderCard();
}

function renderCard() {
    const currentCards = flashcardsCategories[categoryKeys[currentCategoryIndex]];
    cardElement.classList.remove('is-flipped');
    
    // Reset posizione e stile per la nuova card
    innerCard.style.transform = "translateX(0) rotateY(0)";
    innerCard.style.opacity = "1";
    
    questionText.innerText = currentCards[currentIndex].q;
    answerText.innerText = currentCards[currentIndex].a;
    cardNumber.innerText = currentIndex + 1;

    // Aggiorna UI categorie
    document.querySelectorAll('.category-tab').forEach((t, i) => {
        t.classList.toggle('active', i === currentCategoryIndex);
    });

    const activeTab = document.getElementById(`tab-${currentCategoryIndex}`);
    if (activeTab) activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center' });
}

// --- GESTIONE TRASCINAMENTO ---

cardElement.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isDragging = true;
    innerCard.classList.remove('smooth-return');
}, {passive: true});

cardElement.addEventListener('touchmove', e => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX - startX;
    
    // Se la carta è girata, blocchiamo il trascinamento per evitare glitch grafici
    if (cardElement.classList.contains('is-flipped')) return;

    const rotation = currentX / 12; 
    innerCard.style.transform = `translateX(${currentX}px) rotate(${rotation}deg)`;
}, {passive: true});

cardElement.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    innerCard.classList.add('smooth-return');

    const threshold = 100; 

    if (currentX > threshold) {
        animateOut("100%", () => navigate('prev'));
    } else if (currentX < -threshold) {
        animateOut("-100%", () => navigate('next'));
    } else {
        innerCard.style.transform = "translateX(0) rotate(0)";
    }
    currentX = 0;
});

function animateOut(distance, callback) {
    innerCard.style.transform = `translateX(${distance})`;
    innerCard.style.opacity = "0";
    setTimeout(callback, 250);
}

// --- LOGICA DI NAVIGAZIONE CON LOOP INFINITO ---
function navigate(direction) {
    const currentCards = flashcardsCategories[categoryKeys[currentCategoryIndex]];

    if (direction === 'next') {
        if (currentIndex < currentCards.length - 1) {
            // Avanti nella stessa categoria
            currentIndex++;
        } else if (currentCategoryIndex < categoryKeys.length - 1) {
            // Passa alla categoria successiva
            currentCategoryIndex++;
            currentIndex = 0;
        } else {
            // LOOP: Torna alla prima categoria, prima card
            currentCategoryIndex = 0;
            currentIndex = 0;
        }
    } else { // direction === 'prev'
        if (currentIndex > 0) {
            // Indietro nella stessa categoria
            currentIndex--;
        } else if (currentCategoryIndex > 0) {
            // Passa alla categoria precedente (ultima card)
            currentCategoryIndex--;
            currentIndex = flashcardsCategories[categoryKeys[currentCategoryIndex]].length - 1;
        } else {
            // LOOP: Vai all'ultima categoria, ultima card
            currentCategoryIndex = categoryKeys.length - 1;
            currentIndex = flashcardsCategories[categoryKeys[currentCategoryIndex]].length - 1;
        }
    }
    renderCard();
}

function flipCard() { 
    // Gira la carta solo se non la stiamo trascinando
    if (Math.abs(currentX) < 10) {
        cardElement.classList.toggle('is-flipped'); 
    }
}

// Funzioni per i bottoni fisici (se cliccati)
function nextCard() { animateOut("-100%", () => navigate('next')); }
function prevCard() { animateOut("100%", () => navigate('prev')); }

window.onload = init;
