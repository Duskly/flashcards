let currentCategoryIndex = 0;
let currentIndex = 0;
let touchstartX = 0;
let touchendX = 0;

const cardElement = document.getElementById('flashcard');
const questionText = document.getElementById('question');
const answerText = document.getElementById('answer');
const cardNumber = document.getElementById('card-number');
const categoryKeys = Object.keys(flashcardsCategories);

function init() {
    renderCard();
    
    // Gestione CLICK per girare (funziona sempre al primo colpo)
    cardElement.addEventListener('click', function(e) {
        // Se l'utente sta scrollando il testo (back), non girare la carta
        if (e.target.closest('.back') && cardElement.classList.contains('is-flipped')) return;
        cardElement.classList.toggle('is-flipped');
    });

    // Gestione SWIPE rapido
    cardElement.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    }, {passive: true});

    cardElement.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        handleGesture();
    }, {passive: true});
}

function handleGesture() {
    const swipeThreshold = 70; // Sensibilità dello swipe
    if (touchendX < touchstartX - swipeThreshold) navigate('next');
    if (touchendX > touchstartX + swipeThreshold) navigate('prev');
}

function navigate(direction) {
    const currentCards = flashcardsCategories[categoryKeys[currentCategoryIndex]];
    
    if (direction === 'next') {
        if (currentIndex < currentCards.length - 1) {
            currentIndex++;
        } else {
            currentCategoryIndex = (currentCategoryIndex + 1) % categoryKeys.length;
            currentIndex = 0;
        }
    } else {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentCategoryIndex = (currentCategoryIndex - 1 + categoryKeys.length) % categoryKeys.length;
            currentIndex = flashcardsCategories[categoryKeys[currentCategoryIndex]].length - 1;
        }
    }
    renderCard();
}

function renderCard() {
    const categoryName = categoryKeys[currentCategoryIndex];
    const cardData = flashcardsCategories[categoryName][currentIndex];
    
    // Reset stato carta
    cardElement.classList.remove('is-flipped');
    
    // Delay minimo per permettere alla carta di rigirarsi prima di cambiare testo
    setTimeout(() => {
        questionText.innerText = cardData.q;
        answerText.innerText = cardData.a;
        cardNumber.innerText = currentIndex + 1;
        
        // Reset scroll interno del retro
        document.querySelector('.back').scrollTop = 0;
    }, 150);
}

window.onload = init;
