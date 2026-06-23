import './style.css';

// Load all card images using Vite's glob import
const cardModules = import.meta.glob('../../image/*.png', { eager: true, as: 'url' });
// Ensure back image is handled as url
import backImageUrl from '../../back_image/image.png?url';

// Extract URLs
const allCards = Object.values(cardModules);

let deck = [];
let isAnimating = false;

const deckEl = document.getElementById('deck');
const drawnCardEl = document.getElementById('drawn-card');
const deckCountEl = document.getElementById('deck-count');
const shuffleBtn = document.getElementById('shuffle-btn');

// Initialize the deck element with the back image
deckEl.style.backgroundImage = `url(${backImageUrl})`;
drawnCardEl.querySelector('.card-front').style.backgroundImage = `url(${backImageUrl})`;

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function initializeGame() {
  deck = shuffle([...allCards]);
  updateDeckCount();
  
  // Reset active card
  drawnCardEl.classList.remove('flipped');
  drawnCardEl.classList.add('empty');
  setTimeout(() => {
    drawnCardEl.querySelector('.card-back').style.backgroundImage = 'none';
  }, 300); // Wait for unflip animation if there was one
  
  deckEl.classList.remove('empty');
}

function updateDeckCount() {
  deckCountEl.textContent = deck.length;
  if (deck.length === 0) {
    deckEl.classList.add('empty');
  }
}

function drawCard() {
  if (deck.length === 0 || isAnimating) return;
  
  isAnimating = true;
  
  // Pop top card
  const cardUrl = deck.pop();
  updateDeckCount();

  // Reset the drawn card container to prepare for a new draw
  drawnCardEl.classList.remove('flipped');
  drawnCardEl.classList.remove('empty');
  
  // Wait a tiny bit for the reset to take effect, then start the drawing animation
  setTimeout(() => {
    // Set the new image on the back face of the flipping card
    drawnCardEl.querySelector('.card-back').style.backgroundImage = `url(${cardUrl})`;
    
    // Add flip class to trigger CSS animation
    drawnCardEl.classList.add('flipped');
    
    // Release lock after animation finishes
    setTimeout(() => {
      isAnimating = false;
    }, 600); // matches CSS transition duration
  }, 50);
}

// Event Listeners
deckEl.addEventListener('click', drawCard);
shuffleBtn.addEventListener('click', initializeGame);

// Start game on load
initializeGame();
