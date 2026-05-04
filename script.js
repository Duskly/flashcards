// Stato dell'applicazione
let currentCategoryIndex = 0;
let currentIndex = 0;
let touchstartX = 0;
let touchendX = 0;

// Riferimenti agli elementi DOM
const cardElement = document.getElementById('flashcard');
const questionText = document.getElementById('question');
const answerText = document.getElementById('answer');
const cardNumber = document.getElementById('card-number');
const categoriesTabs = document.getElementById('categories-tabs');

// Trasformiamo le chiavi dell'oggetto data.js in un array
const categoryKeys = Object.keys(flashcardsCategories);

/**
 * Inizializza l'interfaccia creando i bottoni delle categorie
 */
function init() {
    categoriesTabs.innerHTML = "";
    categoryKeys.forEach((name, i) => {
        const btn = document.createElement('div');
        btn.className = 'category-tab';
        btn.innerText = name;
        btn.id = `tab-${i}`;
        btn.onclick = () => {
            currentCategoryIndex = i;
            currentIndex = 0;
            renderCard();
        };
        categoriesTabs.appendChild(btn);
    });
    renderCard();
}

/**
 * Aggiorna il contenuto visivo della card
 */
function renderCard() {
    const categoryName = categoryKeys[currentCategoryIndex];
    const currentCards = flashcardsCategories[categoryName];
    
    // Chiude la card (torna al fronte) prima di cambiare testo
    cardElement.classList.remove('is-flipped');
    
    // Piccolo effetto di dissolvenza per il cambio contenuto
    cardElement.style.opacity = "0";
    
    setTimeout(() => {
        questionText.innerText = currentCards[currentIndex].q;
        answerText.innerText = currentCards[currentIndex].a;
        cardNumber.innerText = currentIndex + 1;
        
        // Aggiorna lo stato visivo dei tab in alto
        document.querySelectorAll('.category-tab').forEach((t, i) => {
            t.classList.toggle('active', i === currentCategoryIndex);
        });

        // Fa scorrere il menu delle categorie se il tab attivo esce dallo schermo
        const activeTab = document.getElementById(`tab-${currentCategoryIndex}`);
        if (activeTab) {
            activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
        
        cardElement.style.opacity = "1";
    }, 150);
}

/**
 * Gestisce la navigazione tra card e categorie (Logica a scatto)
 */
function navigate(direction) {
    const currentCards = flashcardsCategories[categoryKeys[currentCategoryIndex]];

    if (direction === 'next') {
        if (currentIndex < currentCards.length - 1) {
            currentIndex++;
        } else if (currentCategoryIndex < categoryKeys.length - 1) {
            // Passa alla prima card della categoria successiva
            currentCategoryIndex++;
            currentIndex = 0;
        } else {
            // Loop: torna alla primissima card assoluta
            currentCategoryIndex = 0;
            currentIndex = 0;
        }
    } else { // direction === 'prev'
        if (currentIndex > 0) {
            currentIndex--;
        } else if (currentCategoryIndex > 0) {
            // Passa all'ultima card della categoria precedente
            currentCategoryIndex--;
            currentIndex = flashcardsCategories[categoryKeys[currentCategoryIndex]].length - 1;
        } else {
            // Loop: va all'ultima card dell'ultima categoria
            currentCategoryIndex = categoryKeys.length - 1;
            currentIndex = flashcardsCategories[categoryKeys[currentCategoryIndex]].length - 1;
        }
    }
    renderCard();
}

// Funzioni collegate ai bottoni HTML
function nextCard() { navigate('next'); }
function prevCard() { navigate('prev'); }
function flipCard() { cardElement.classList.toggle('is-flipped'); }

/**
 * Gestione Gesti Touch (Swipe)
 */
cardElement.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
}, {passive: true});

cardElement.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    handleSwipe();
}, {passive: true});

function handleSwipe() {
    const swipeThreshold = 60; // Pixel necessari per attivare lo swipe
    
    // Se la card è girata (mostra la risposta), lo swipe non deve avvenire 
    // o deve prima rigirare la card? Di solito è meglio navigare solo dal fronte.
    // Se preferisci navigare sempre, rimuovi il controllo is-flipped.
    
    if (touchendX < touchstartX - swipeThreshold) {
        nextCard(); // Swipe verso sinistra
    }
    if (touchendX > touchstartX + swipeThreshold) {
        prevCard(); // Swipe verso destra
    }
}

// Avvio
window.onload = init;
