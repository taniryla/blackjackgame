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
let dollars;
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
const betBtn = document.querySelector('#betBtn');
dollars = document.querySelector('#dollars');

// /*----- event listeners -----*/
hitBtn.addEventListener('click', handleHit);
standBtn.addEventListener('click', endGame);
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
  }
  render();
}

function blackJackCheck() { // only after initial deal
  dealerPoints = computePoints(dealerCards);
  playerPoints = computePoints(playerCards);
  if (dealerPoints === 21 && playerPoints === 21) {
    winner = 'T';
  } else if (playerPoints === 21) {
    winner = 'PBJ';
  } else if (dealerPoints === 21) {
    winner = 'DBJ';
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
  cards.forEach(card => {
    if (card.value === 11) aceCount++;
    total += card.value;
  });
  while (aceCount && total > 21) {
    total = total - 10;
    aceCount--;
  }
  return total;
}

function handleHit() {
  playerCards.push(deck.pop());
  playerPoints = computePoints(playerCards);
  if (playerPoints > 21) {
    winner = 'L'; // player loses
  }
  render();
}

function endGame() {
  while (dealerPoints < 17) {
    dealerCards.push(deck.pop());
    dealerPoints = computePoints(dealerCards);
  }
  dealerValue.innerHTML = dealerPoints;

  if (playerPoints === dealerPoints) {
    winner = 'T';
  } else if (dealerPoints === 21) {
    winner = 'DBJ';
  } else if (playerPoints === 21) {
    winner = 'PBJ';
  } else if (playerPoints > 21) {
    winner = 'L';
  } else if (dealerPoints > 21) {
    winner = 'W';
  } else if (playerPoints < dealerPoints && dealerPoints < 21) {
    winner = 'L';
  } else if (playerPoints > dealerPoints && playerPoints < 21) {
    winner = 'W';
  }
  render();
};

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
  renderMessage(winner, wager);
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

function renderMessage(winner, wager) {
  if (winner === 'T') { // push
    message.innerHTML = `“You and the dealer have pushed. You have ${playerPoints} and the dealer has ${dealerPoints}. Your bet of $${wager} will neither be added or subtracted from your chip total. Would you like to play again? Click on DEAL.”`;
    dollars.innerHTML = myDollars;
  } else if (winner === 'PBJ') {
    message.innerHTML = `“You win a black jack! $${Math.floor(wager * 1.5)} was added to your chip total. Would you like to play again? Click on DEAL.”`;
    myDollars += Math.floor(wager * 1.5);
    dollars.innerHTML = myDollars;
  } else if (winner === 'DBJ') {
    message.textContent = `“You lose to the dealer's black jack! $${wager} was already subtracted to your chip total at the beginning of play. Would you like to play again? Click on DEAL.”`;
    myDollars -= wager;
    dollars.innerHTML = myDollars;
  } else if (winner === 'W') { // player won
    message.innerHTML = `“You win! You have ${playerPoints} and the dealer has ${dealerPoints}. $${wager} was added to your chip total. Would you like to play again? Click on DEAL.”`;
    myDollars += wager;
    dollars.innerHTML = myDollars;
  } else if (winner === 'L') { // dealer win
    message.textContent = `“You lose! You have ${playerPoints} and the dealer has ${dealerPoints}. $${wager} was already subtracted to your chip total at the beginning of play. Would you like to play again? Click on DEAL.”`;
    myDollars -= wager;
    dollars.innerHTML = myDollars;
  }
}

