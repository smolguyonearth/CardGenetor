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
let discardPile = [];
let currentlyInspectedIndex = null;

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
const discardPileEl = document.getElementById('discard-pile');

const inspectOverlay = document.getElementById('inspect-overlay');
const inspectCardEl = document.getElementById('inspect-card');
const inspectUseBtn = document.getElementById('inspect-use-btn');
const inspectSendBtn = document.getElementById('inspect-send-btn');
const inspectCloseBtn = document.getElementById('inspect-close-btn');

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
  discardPile = [];
  
  updateDeckCount();
  deckEl.classList.remove('empty');
  updateDiscardPile();
  
  showTransitionScreen(1);
}

function updateDeckCount() {
  deckCountEl.textContent = deck.length;
  if (deck.length === 0) {
    deckEl.classList.add('empty');
  }
}

function updateDiscardPile() {
  if (discardPile.length === 0) {
    discardPileEl.classList.add('empty');
    discardPileEl.style.backgroundImage = 'none';
  } else {
    discardPileEl.classList.remove('empty');
    discardPileEl.style.backgroundImage = `url(${discardPile[discardPile.length - 1]})`;
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

function useInspectedCard() {
  if (currentlyInspectedIndex === null) return;
  
  const card = hands[currentPlayer].splice(currentlyInspectedIndex, 1)[0];
  discardPile.push(card);
  
  updateDiscardPile();
  closeInspect();
  renderPlayerArea();
}

function sendInspectedCard() {
  if (currentlyInspectedIndex === null) return;
  
  const card = hands[currentPlayer].splice(currentlyInspectedIndex, 1)[0];
  const otherPlayer = currentPlayer === 1 ? 2 : 1;
  hands[otherPlayer].push(card);
  
  closeInspect();
  renderPlayerArea();
}

function inspectCard(index) {
  if (isTransitioning) return;
  currentlyInspectedIndex = index;
  const cardUrl = hands[currentPlayer][index];
  
  inspectCardEl.style.backgroundImage = `url(${cardUrl})`;
  
  const otherPlayer = currentPlayer === 1 ? 2 : 1;
  inspectSendBtn.textContent = `Send to Player ${otherPlayer}`;
  
  inspectOverlay.classList.add('active');
}

function closeInspect() {
  inspectOverlay.classList.remove('active');
  currentlyInspectedIndex = null;
}

function createCardElement(url, index, isHand) {
  const cardDiv = document.createElement('div');
  cardDiv.className = 'card min-card';
  cardDiv.style.backgroundImage = `url(${url})`;
  
  if (isHand) {
    cardDiv.classList.add('hand-card');
    cardDiv.onclick = () => inspectCard(index);
  } else {
    cardDiv.classList.add('used-card');
  }
  
  return cardDiv;
}

function renderPlayerArea() {
  playerHandEl.innerHTML = '';
  
  hands[currentPlayer].forEach((url, index) => {
    playerHandEl.appendChild(createCardElement(url, index, true));
  });
}

// Event Listeners
deckEl.addEventListener('click', drawCard);
shuffleBtn.addEventListener('click', initializeGame);
startTurnBtn.addEventListener('click', startTurn);
endTurnBtn.addEventListener('click', endTurn);

inspectUseBtn.addEventListener('click', useInspectedCard);
inspectSendBtn.addEventListener('click', sendInspectedCard);
inspectCloseBtn.addEventListener('click', closeInspect);

// Start game on load
initializeGame();
