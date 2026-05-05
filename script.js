let currentCategoryIndex = 0;
let currentIndex = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;
let isSwiping = false; // Nuova variabile di controllo

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
    cardElement.classList.remove('is-flipped');
    
    // Reset immediato posizioni
    innerCard.style.transition = "none";
    innerCard.style.transform = "translateX(0) rotateY(0)";
    innerCard.style.opacity = "1";
    
    questionText.innerText = currentCards[currentIndex].q;
    answerText.innerText = currentCards[currentIndex].a;
    cardNumber.innerText = currentIndex + 1;

    document.querySelectorAll('.category-tab').forEach((t, i) => {
        t.classList.toggle('active', i === currentCategoryIndex);
    });

    const activeTab = document.getElementById(`tab-${currentCategoryIndex}`);
    if (activeTab) activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center' });
}

// --- GESTIONE TOUCH ---

cardElement.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isDragging = true;
    isSwiping = false; // Reset ad ogni tocco
    innerCard.style.transition = "none";
}, {passive: true});

cardElement.addEventListener('touchmove', e => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX - startX;
    
    // Se il movimento supera i 10px, lo consideriamo uno swipe e non un click
    if (Math.abs(currentX) > 10) {
        isSwiping = true;
    }

    if (!cardElement.classList.contains('is-flipped')) {
        const rotation = currentX / 15;
        innerCard.style.transform = `translateX(${currentX}px) rotate(${rotation}deg)`;
    }
}, {passive: true});

cardElement.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;

    const threshold = 100;
    innerCard.style.transition = "transform 0.3s ease-out, opacity 0.3s";

    if (isSwiping && currentX > threshold) {
        animateOut("100%");
    } else if (isSwiping && currentX < -threshold) {
        animateOut("-100%");
    } else {
        // Torna al centro se non è uno swipe valido
        innerCard.style.transform = cardElement.classList.contains('is-flipped') ? "rotateY(180deg)" : "translateX(0) rotate(0)";
    }
    
    // Importante: resettiamo currentX dopo un piccolo delay per non disturbare il click
    setTimeout(() => { currentX = 0; }, 50);
});

// Funzione dedicata al click/tap
function flipCard() {
    // Giriamo la carta SOLO se non stavamo swippando
    if (!isSwiping) {
        cardElement.classList.toggle('is-flipped');
    }
}

// Colleghiamo esplicitamente l'onclick nel JS per sicurezza
cardElement.onclick = flipCard;

function animateOut(direction) {
    innerCard.style.transform = `translateX(${direction}) rotate(${direction === "100%" ? 20 : -20}deg)`;
    innerCard.style.opacity = "0";
    setTimeout(() => {
        navigate(direction === "100%" ? 'prev' : 'next');
    }, 250);
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

window.onload = init;
