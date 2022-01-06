// /*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const masterDeck = buildMasterDeck();

// /*----- app's state (variables) -----*/
let playerCards;
let dealerCards;
let playerPoints;
let dealerPoints;
let deck;
let wager;
let myDollars;// myDollars tracks how much money 
let winner;// winner tracks (2 : dealer won), (1 : player won), (0 : push)

// /*----- cached element references -----*/
const dealerSlot = document.querySelector('#dealerSlot');
const playerSlot = document.querySelector('#playerSlot');
const playerValue = document.querySelector('#playerValue');
const dealerValue = document.querySelector('#dealerValue');
const hitBtn = document.querySelector('#hitBtn');
const standBtn = document.querySelector('#standBtn');
const dealBtn = document.querySelector('#dealBtn');
const enterBet = document.querySelector('#enterBet');
const message = document.querySelector('#message');
const dollars = document.querySelector('#dollars');
const betBtn = document.querySelector('#betBtn');

// /*----- event listeners -----*/
hitBtn.addEventListener('click', renderHit);
standBtn.addEventListener('click', renderStand);
dealBtn.addEventListener('click', handleDeal);
betBtn.addEventListener('click', handleSetBet);
enterBet.addEventListener('change', render);

// /*----- functions -----*/
init();

function handleDeal() {
    winner = null;
    deck = getNewShuffledDeck();
    playerCards = [deck.pop(), deck.pop()];
    dealerCards = [deck.pop(), deck.pop()];
    blackJackCheck();
    render();
}

function handleSetBet() {
  const bet = parseInt(enterBet.value);
  if (bet <= myDollars) {
    wager = bet;
    myDollars -= bet;
  } 
  render();
}

function blackJackCheck() { // only after initial deal
  dealerPoints = computePoints(dealerCards);
  playerPoints = computePoints(playerCards);
  if (dealerPoints === 21 && playerPoints === 21) {
    winner = 'T';
    myDollars += wager;
    wager = 0;
  } else if (playerPoints === 21) {
    winner = 'PBJ'; 
    myDollars += wager + Math.floor(wager * 1.5);
    wager = 0;
  } else if (dealerPoints === 21) {
    winner = 'DBJ';
    wager = 0;
  }
}
// intialize all state, then call render()

function init() { // deal new deck of shuffled card
  playerCards = [];
  dealerCards = [];
  myDollars = 100;
  render();
}

// Get a new Shuffled deck.

function getNewShuffledDeck() {
  const tempDeck = [...masterDeck];
  const newShuffledDeck = [];
  while (tempDeck.length) {
    const rndIdx = Math.floor(Math.random() * tempDeck.length);
    newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
  }
  return newShuffledDeck;
}

function buildMasterDeck() {
  let deck = [];
  suits.forEach(function (suit) {
    ranks.forEach(function (rank) {
      deck.push({
        face: `${suit}${rank}`,
        value: Number(rank) || (rank === 'A' ? 11 : 10)
      });
    });
  });
  return deck;
}
// update all impacted state in variables, then call render... don't use the DOM to hold state

function computePoints(cards) {
  let total = 0;
  let aceCount = 0;
  cards.forEach((card, idx) => {
    if (card[idx].value === 11) aceCount++;
    total += card[idx].value;
  });
  while (aceCount && total > 21) {
    total = total - 10;
    aceCount--;
  }
  return total;
}

function render() { // only update the state and DOM from the render() function
  const handInProgress = !winner && playerCards.length;
  dealBtn.style.visibility = handInProgress || !wager ? 'hidden' : 'visible';
  standBtn.style.visibility = handInProgress ? 'visible' : 'hidden';
  hitBtn.style.visibility = handInProgress ? 'visible' : 'hidden';
  enterBet.disabled = handInProgress;
  betBtn.disabled = !(parseInt(enterBet.value) > 0);
  renderHands();
  handInProgress ? message.innerHTML = `You have ${playerPoints}. Hit or Stand?`
  : message.innerHTML = 'Enter your bet + click the "Set Bet" button';
  renderWin();
  renderMessage(winner);
}
 
function renderHands() {
  const handInProgress = !winner && playerCards.length;
  let html = '';     
  playerCards.forEach(card => {
    html += `<div class="card ${card.face}"></div>`;
  });
  playerSlot.innerHTML = html;
  playerValue.innerHTML = playerPoints;
  html = '';
  dealerCards.forEach((card, idx) => {
    const cardClass = handInProgress && idx === 0 ? 'back' : card.face;
    html += `<div class="card ${cardClass}"></div>`;
  });
  dealerSlot.innerHTML = html;
  if (!handInProgress) {
    dealerValue.innerHTML = dealerPoints;
  }
  dealerValue.innerHTML = ''; 
}

function renderHit() {
  playerCards.push(deck.pop());
  playerPoints = computePoints(playerCards);
  if (playerPoints > 21) {
    winner = 'L'; // player loses
    wager = 0;
    console.log(winner);
  }
  render();
}

function renderStand() {
  dealerPoints = computePoints(dealerCards);
  while (dealerPoints < 17) {
    dealerCards.push(deck.pop());
  }
  if (dealerPoints > 21) {
    winner = 'W'; // dealer loses
    wager = 0;
  }
  render();
}

function renderWin() {
const handFinished = dealerPoints > 17;
  if ((playerPoints === dealerPoints) && handFinished) {
    winner = 'T';
  } else if ((playerPoints < dealerPoints) && handFinished) {
    winner = 'L';
  } else if ((playerPoints > dealerPoints) && handFinished) {
    winner = 'W';
  }
};

function renderMessage() {
  if (winner === 'T') { // push
    message.innerHTML = `“You and the dealer have pushed. Your bet of $${wager} will neither be added or subtracted from your chip total. Would you like to play again?”`;
  } else if (winner === 'PBJ') {
    message.innerHTML = `“You win a black jack! $${wager + Math.floor(wager * 1.5)} was added to your chip total. Would you like to play again?”`;
  } else if (winner === 'DBJ') { 
    message.textContent = `“You lose to the dealer's black jack! $${wager} was already subtracted to your chip total at the beginning of play. Would you like to play again?”`;
  } else if (winner === 'W') { // player won
    message.innerHTML = `“You win! $${wager} was added to your chip total. Would you like to play again?”`;
  } else if (winner === 'L') { // dealer wins
    message.textContent = `“You lose! $${wager} was already subtracted to your chip total at the beginning of play. Would you like to play again?”`;
  }
}

