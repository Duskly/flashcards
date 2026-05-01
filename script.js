// script.js

// Ottieni i riferimenti agli elementi HTML
const categoriesTabs = document.getElementById('categories-tabs');
const cardElement = document.getElementById('flashcard');
const questionText = document.getElementById('question');
const answerText = document.getElementById('answer');
const cardNumberText = document.getElementById('card-number');

// Stato dell'applicazione
let currentCategory = ""; // Categoria attiva
let currentCardsArray = []; // Array di card della categoria attiva
let currentIndex = 0; // Indice della card attuale all'interno dell'array

// 1. Funzione per creare dinamicamente i pulsanti delle categorie
function initCategories() {
    categoriesTabs.innerHTML = ""; // Pulisci eventuali pulsanti vecchi
    
    // Ottieni tutte le chiavi (nomi delle categorie) da data.js
    const categoryNames = Object.keys(flashcardsCategories);
    
    // Crea un pulsante per ogni categoria
    categoryNames.forEach((name, index) => {
        const tab = document.createElement('div');
        tab.classList.add('category-tab');
        tab.innerText = name;
        tab.onclick = () => selectCategory(name);
        categoriesTabs.appendChild(tab);
        
        // Seleziona la prima categoria all'avvio
        if (index === 0) {
            selectCategory(name);
        }
    });
}

// 2. Funzione per cambiare categoria
function selectCategory(categoryName) {
    currentCategory = categoryName;
    currentCardsArray = flashcardsCategories[categoryName];
    currentIndex = 0; // Ricomincia dalla prima card
    
    // Evidenzia visivamente il pulsante attivo
    const allTabs = document.querySelectorAll('.category-tab');
    allTabs.forEach(tab => tab.classList.remove('active'));
    allTabs.forEach(tab => {
        if(tab.innerText === categoryName) {
            tab.classList.add('active');
        }
    });
    
    updateCardContent(); // Aggiorna la card subito
}

// 3. Funzione per aggiornare il contenuto e il numero della card attuale
function updateCardContent() {
    const currentData = currentCardsArray[currentIndex];
    
    // Fronte
    questionText.innerText = currentData.q;
    
    // Retro (mantiene i ritorni a capo grazie a `white-space: pre-line` nel CSS)
    answerText.innerText = currentData.a;
    
    // Numero d'ordine in basso a destra
    cardNumberText.innerText = currentIndex + 1;
}

// 4. Logica delle interazioni
function flipCard() {
    cardElement.classList.toggle('is-flipped');
}

function nextCard() {
    cardElement.classList.remove('is-flipped'); // Torna sul fronte
    setTimeout(() => {
        currentIndex = (currentIndex + 1) % currentCardsArray.length;
        updateCardContent();
    }, 200); // Aspetta che la carta sia a metà rotazione
}

function prevCard() {
    cardElement.classList.remove('is-flipped');
    setTimeout(() => {
        currentIndex = (currentIndex - 1 + currentCardsArray.length) % currentCardsArray.length;
        updateCardContent();
    }, 200);
}

// 5. Avvio
window.onload = initCategories;