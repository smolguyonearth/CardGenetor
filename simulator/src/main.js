import './style.css';

// Load all card images
const cardModules = import.meta.glob('../../image/*.png', { eager: true, as: 'url' });
import backImageUrl from '../../back_image/image.png?url';

const allCards = Object.values(cardModules);

// Game State
let deck = [];
let currentPlayer = 1;
let isTransitioning = true;
let hands = { 1: [], 2: [] };
let usedCards = { 1: [], 2: [] };

// DOM Elements
const deckEl = document.getElementById('deck');
const deckCountEl = document.getElementById('deck-count');
const shuffleBtn = document.getElementById('shuffle-btn');
const overlayEl = document.getElementById('turn-overlay');
const overlayTitle = document.getElementById('overlay-title');
const startTurnBtn = document.getElementById('start-turn-btn');
const endTurnBtn = document.getElementById('end-turn-btn');
const playerTurnTitle = document.getElementById('player-turn-title');
const playerHandEl = document.getElementById('player-hand');
const playerUsedEl = document.getElementById('player-used');

// Initialize back image on deck
deckEl.style.backgroundImage = `url(${backImageUrl})`;

function shuffle(array) {
  let arr = [...array];
  let currentIndex = arr.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
  }
  return arr;
}

function initializeGame() {
  deck = shuffle(allCards);
  currentPlayer = 1;
  hands = { 1: [], 2: [] };
  usedCards = { 1: [], 2: [] };
  
  updateDeckCount();
  deckEl.classList.remove('empty');
  
  showTransitionScreen(1);
}

function updateDeckCount() {
  deckCountEl.textContent = deck.length;
  if (deck.length === 0) {
    deckEl.classList.add('empty');
  }
}

function showTransitionScreen(playerNum) {
  isTransitioning = true;
  overlayTitle.textContent = `Pass device to Player ${playerNum}`;
  overlayEl.classList.add('active');
}

function startTurn() {
  isTransitioning = false;
  overlayEl.classList.remove('active');
  playerTurnTitle.textContent = `Player ${currentPlayer}'s Turn`;
  renderPlayerArea();
}

function endTurn() {
  if (isTransitioning) return;
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  showTransitionScreen(currentPlayer);
}

function drawCard() {
  if (deck.length === 0 || isTransitioning) return;
  
  const cardUrl = deck.pop();
  updateDeckCount();
  
  hands[currentPlayer].push(cardUrl);
  renderPlayerArea();
}

function useCard(index) {
  if (isTransitioning) return;
  
  const card = hands[currentPlayer].splice(index, 1)[0];
  usedCards[currentPlayer].push(card);
  renderPlayerArea();
}

function createCardElement(url, index, isHand) {
  const cardDiv = document.createElement('div');
  cardDiv.className = 'card min-card';
  cardDiv.style.backgroundImage = `url(${url})`;
  
  if (isHand) {
    cardDiv.classList.add('hand-card');
    cardDiv.onclick = () => useCard(index);
  } else {
    cardDiv.classList.add('used-card');
  }
  
  return cardDiv;
}

function renderPlayerArea() {
  playerHandEl.innerHTML = '';
  playerUsedEl.innerHTML = '';
  
  hands[currentPlayer].forEach((url, index) => {
    playerHandEl.appendChild(createCardElement(url, index, true));
  });
  
  usedCards[currentPlayer].forEach((url, index) => {
    playerUsedEl.appendChild(createCardElement(url, index, false));
  });
}

// Event Listeners
deckEl.addEventListener('click', drawCard);
shuffleBtn.addEventListener('click', initializeGame);
startTurnBtn.addEventListener('click', startTurn);
endTurnBtn.addEventListener('click', endTurn);

// Start game on load
initializeGame();
