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
hitBtn.addEventListener('click', handleHit);
standBtn.addEventListener('click', endPlay);
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


function handleHit() {
  renderHitCard();
  playerPoints > 21 ? renderPlayerBustMessage() : renderHitCard(); // goes over to dealer turn
}

function endPlay() {
  if (dealerPoints < 17) {
    renderDealerPlayout()
    dealerTotal();
  }
  dealerPoints > 21 ? renderDealerBustMessage() : renderDealerPlayout(); // determine winner
}

function winningFormula() {
  if (playerPoints === dealerPoints) {
    winner = 0;
  } else if (playerPoints < dealerPoints) {
    winner = 2;
  } else {
    winner = 1;
  }
  renderWinMessage();
};


function render() { // only update the DOM from the render() function
  const handInProgress = !winner && playerCards.length;
  console.log(handInProgress);
  dealBtn.style.visibility = handInProgress || !wager ? 'hidden' : 'visible';
  standBtn.style.visibility = handInProgress ? 'visible' : 'hidden';
  hitBtn.style.visibility = handInProgress ? 'visible' : 'hidden';
  betBtn.disabled = !(parseInt(enterBet.value) > 0);
  renderHands();
  renderValues();
  message.innerText = `You have ${playerPoints}. Hit or Stand?`;
}


function renderValues() {
  playerValue.innerHTML = playerPoints;
  dealerValue.innerHTML = dealerPoints;
}


function renderHands() {
  let html = '';     
  playerCards.forEach(card => {
    html += `<div class="card ${card.face}"></div>`;
  });
  playerSlot.innerHTML = html;
  html = '';
  dealerCards.forEach((card, idx) => {
    const handInProgress = !winner && playerCards.length;
    const cardClass = handInProgress && idx === 0 ? 'back' : card.face;
    html += `<div class="card ${cardClass}"></div>`;
  });
  dealerSlot.innerHTML = html;
}

function renderHitCard() {
  for (let i = 2; i < playerCards.length; i++) {
    playerCards.push(shuffledDeck.pop());
    playerSlot.innerHTML += `<div class="card ${playerCards[i].face}"></div>`;
    playerTotal();
  }
}

function renderDealerPlayout() {
  for (let i = 2; i < dealerCards.length; i++) {
    dealerCards.push(shuffledDeck.pop());
    dealerSlot.innerHTML += `<div class="card ${dealerCards[i].face}"></div>`;
    dealerTotal();
  }
}

function renderPlayerBustMessage() {
  if (playerPoints > 21) {
    message.innerHTML = `You've busted! $${enterBet.value} was subtracted to your chip total. Would you like to play again?`;
  }
  renderNewGame();
}

function renderDealerBustMessage() {
  if (dealerPoints > 21) {
    message.innerHTML = `Dealer busted! $${enterBet.value} was added to your chip total. Would you like to play again?`;
  }
  renderNewGame();
}

function renderWinMessage(winner) {
  if (winner === 0) { // push
    message.innerHTML = `“You and the dealer have pushed. Your bet of ${enterBet.value} will neither be added or subtracted from your chip total. Would you like to play again?”`;
  } else if (winner === 1) { // player won
    message.innerHTML = `“You win! ${enterBet.value * 2} was added to your chip total. Would you like to play again?”`;
  } else { // dealer wins
    message.textContent = `“You lose! ${enterBet.value} was already subtracted to your chip total at the beginning of play. Would you like to play again?”`;
  }
  renderDistribution();
}

