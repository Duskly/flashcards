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
    // --- RECUPERO MEMORIA ---
    // Leggiamo se ci sono dati salvati precedentemente
    const savedCategory = localStorage.getItem('lastCategory');
    const savedIndex = localStorage.getItem('lastIndex');
    
    if (savedCategory !== null && savedIndex !== null) {
        currentCategoryIndex = parseInt(savedCategory);
        currentIndex = parseInt(savedIndex);
    }
    // ------------------------

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

    cardElement.addEventListener('click', function(e) {
        if (cardElement.classList.contains('is-flipped') && e.target.closest('.back')) {
            return; 
        }
        cardElement.classList.toggle('is-flipped');
    });

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

function nextCard() {
    const currentCards = flashcardsCategories[categoryKeys[currentCategoryIndex]];
    if (currentIndex < currentCards.length - 1) {
        currentIndex++;
    } else {
        currentCategoryIndex = (currentCategoryIndex + 1) % categoryKeys.length;
        currentIndex = 0;
    }
    renderCard();
}

function prevCard() {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentCategoryIndex = (currentCategoryIndex - 1 + categoryKeys.length) % categoryKeys.length;
        currentIndex = flashcardsCategories[categoryKeys[currentCategoryIndex]].length - 1;
    }
    renderCard();
}

function renderCard() {
    const categoryName = categoryKeys[currentCategoryIndex];
    const cardData = flashcardsCategories[categoryName][currentIndex];
    
    // --- SALVATAGGIO POSIZIONE ---
    // Ogni volta che mostriamo una carta, salviamo dove siamo
    localStorage.setItem('lastCategory', currentCategoryIndex);
    localStorage.setItem('lastIndex', currentIndex);
    // -----------------------------

    cardElement.classList.remove('is-flipped');
    
    setTimeout(() => {
        questionText.innerText = cardData.q;
        answerText.innerText = cardData.a;
        cardNumber.innerText = currentIndex + 1;
        
        const backSide = document.querySelector('.back');
        if (backSide) backSide.scrollTop = 0;

        document.querySelectorAll('.category-tab').forEach((t, i) => {
            t.classList.toggle('active', i === currentCategoryIndex);
        });

        const activeTab = document.getElementById(`tab-${currentCategoryIndex}`);
        if (activeTab) {
            activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }, 150);
}

window.onload = init;
