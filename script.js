let currentCategoryIndex = 0;
let currentIndex = 0;
let touchstartX = 0;
let touchendX = 0;

const cardElement = document.getElementById('flashcard');
const questionText = document.getElementById('question');
const answerText = document.getElementById('answer');
const cardNumber = document.getElementById('card-number');
const categoriesTabs = document.getElementById('categories-tabs');
const categoryKeys = Object.keys(flashcardsCategories);

function init() {
    // 1. Popola le categorie in alto
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

    // 2. Gestione CLICK sulla carta per girarla
    cardElement.addEventListener('click', function(e) {
        // Se stiamo cliccando dentro il retro e la carta è già girata, 
        // permettiamo l'interazione col testo (scroll) senza rigirare subito.
        if (cardElement.classList.contains('is-flipped') && e.target.closest('.back')) {
            return; 
        }
        cardElement.classList.toggle('is-flipped');
    });

    // 3. Gestione SWIPE
    cardElement.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    }, {passive: true});

    cardElement.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        handleGesture();
    }, {passive: true});

    renderCard();
}

function handleGesture() {
    const swipeThreshold = 70;
    if (touchendX < touchstartX - swipeThreshold) nextCard();
    if (touchendX > touchstartX + swipeThreshold) prevCard();
}

// Funzioni per i bottoni e lo swipe
function nextCard() {
    const currentCards = flashcardsCategories[categoryKeys[currentCategoryIndex]];
    if (currentIndex < currentCards.length - 1) {
        currentIndex++;
    } else {
        // Loop alla categoria successiva o alla prima
        currentCategoryIndex = (currentCategoryIndex + 1) % categoryKeys.length;
        currentIndex = 0;
    }
    renderCard();
}

function prevCard() {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        // Loop alla categoria precedente o all'ultima
        currentCategoryIndex = (currentCategoryIndex - 1 + categoryKeys.length) % categoryKeys.length;
        currentIndex = flashcardsCategories[categoryKeys[currentCategoryIndex]].length - 1;
    }
    renderCard();
}

function renderCard() {
    const categoryName = categoryKeys[currentCategoryIndex];
    const cardData = flashcardsCategories[categoryName][currentIndex];
    
    // Reset classe flip
    cardElement.classList.remove('is-flipped');
    
    // Aggiorna contenuti
    setTimeout(() => {
        questionText.innerText = cardData.q;
        answerText.innerText = cardData.a;
        cardNumber.innerText = currentIndex + 1;
        
        // Reset scroll del retro
        const backSide = document.querySelector('.back');
        if (backSide) backSide.scrollTop = 0;

        // Aggiorna stile tab attivi
        document.querySelectorAll('.category-tab').forEach((t, i) => {
            t.classList.toggle('active', i === currentCategoryIndex);
        });

        // Centra il tab attivo se esce dallo schermo
        const activeTab = document.getElementById(`tab-${currentCategoryIndex}`);
        if (activeTab) {
            activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }, 150);
}

// Avvio
window.onload = init;
