// /*----- constants -----*/
// Define required constants:

const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

// /*----- app's state (variables) -----*/
// Define required variables used to track the state of the game:

let playerCards;
let dealerCards;
let deck;
let playerPoints;
let dealerPoints;
let shuffledDeck;
let turn;// whose turn is it? 0 for player, 1 for dealer, 2 for game over
let cardCount;
let cardValue;
let myDollars;// myDollars traks how much money in the chipFinal tag
let winner;// winner tracks 2 : computer won, 1 : player won, 0 : push

// /*----- cached element references -----*/
// Store elements on the page that will be accessed in code more than once in variables to make code more concise, readable and performant:

let dealerSlot = document.querySelector('#dealerSlot');
let playerSlot = document.querySelector('#playerSlot');
const hitBtn = document.querySelector('#hitBtn');
const standBtn = document.querySelector('#standBtn');
const newGameBtn = document.querySelector('#newGameBtn');
const newShuffledDeck = document.querySelector('#newShuffledDeck');
const masterDeckContainer = document.getElementById('master-deck-container');
const button = document.querySelector('button'); // revisit this one
const shuffledContainer = document.getElementById('shuffled-deck-container');
let enterBet = document.querySelector('#enterBet');
let message = document.querySelector('#message');
let dealBtn = document.querySelector('#dealBtn');
myDollars = document.querySelector('#dollars');

// /*----- event listeners -----*/
// 3.3) Add all event listeners

hitBtn.addEventListener('click', handleHit);
standBtn.addEventListener('click', endPlay);
newGameBtn.addEventListener('click', startNewGame);
button.addEventListener('click', renderNewShuffledDeck); // revisit this one
dealBtn.addEventListener('click', init)


// /*----- functions -----*/
function startNewGame() {
  dealBtn.style.visibility = 'visible';
  newGameBtn.style.visibility = 'hidden';
  enterBet.disabled = true; 
  standBtn.style.visibility = 'hidden';
  hitBtn.style.visibility = 'hidden';
}

  // intialize all state, then call render()
function init() {
  playerCards = [];
  dealerCards = [];
  deck = [];
  myDollars = 100;
  playerPoints = 0;
  dealerPoints = 0;
  cardCount = 0;
  cardValue = 0;
  turn = 0; // 0 for player, 1 for dealer
  winner = null;
  render();
}

     // Get a new Shuffled deck.
  const masterDeck = buildMasterDeck();
  renderDeckInContainer(masterDeck, masterDeckContainer);

  function getNewShuffledDeck() {
    const tempDeck = [...masterDeck];
    const newShuffledDeck = [];
    while (tempDeck.length) {
      const rndIdx = Math.floor(Math.random() * tempDeck.length);
      newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    }
    return newShuffledDeck;
  }
  
  function renderNewShuffledDeck() {
    shuffledDeck = getNewShuffledDeck();
    renderDeckInContainer(shuffledDeck, shuffledContainer);
  }

  function renderDeckInContainer(deck, container) {
    container.innerHTML = '';
    const cardsHtml = deck.reduce(function(html, card) {
      return html + `<div class="card ${card.face}"></div>`;
    }, '');
    container.innerHTML = cardsHtml;
  }
  
  function buildMasterDeck() {
    let deck = [];
    aceFactor = 0; 
    suits.forEach(function(suit) {
      ranks.forEach(function(rank) {
        deck.push({
          face: `${suit}${rank}`,
          value: Number(rank) || (rank === 'A' ? 1 : 10)
        });
      });
    });
    return deck;
  }  
  renderNewShuffledDeck();

// update all impacted state in variables, then call render

function createPlayerCards() {
  cardValue[cardCount] = shuffledDeck.pop();
  playerCards.push(cardValue[cardCount]);
  cardCount++;
}

function check(arr) {
  let total = 0;
  aceFlag = false;
  for (let i in arr) {
    if(arr[i].ranks === 'A' && !aceFlag) {
      aceFlag = true;
      total = total + 10;
    }
    total = total + arr[i].value;
   }
   if(aceFlag && total > 21) {
     total = total - 10;
   }
   return total;
} 
  
function playerTotal(playerCards) {
  for (let i = 0; i < playerCards.length; i++){
    playerPoints = playerCards[i].value;
  }
  playerSlot.innerHTML = playerPoints;
}

// check for immediate player victory (if blackjack is hit off the bat)
function softCheck (arr) {
  check(arr);
  (dealerPoints === 21 && playerPoints === 21) ? (winner === 0)
  : (playerPoints === 21 && dealerPoints !== 21) ?  (winner === 1)  
  : (dealerPoints === 21 & playerPoints !== 21) ? (winner === 2) 
  : message.innerText = `You have ${playerPoints}. Hit or Stand?`; 
  renderWinMessage();
}

function dealDealerCards() {
  renderDealerCards();
  cardCount++;
  renderDealerCards();
  cardCount++;
}

function createDealerCards(){
    // to determine if we keep sending dealer cards
      cardValue[cardCount] = shuffledDeck.pop();
      dealerCards.push(cardValue[cardCount]);
      cardCount++;
}

function dealerTotal(dealerCards){
  for (let i = 0; i < dealerCards.length; i++){
    dealerPoints = dealerCards[i].value;
  }
    dealerSlot.innerHTML = dealerPoints;
  }

  // attempting to refactor my hit and stand functions to generalize

function handleHit(){
  renderPlayerCards();
  playerPoints = check(playerCards); // account for the ace dual value and bust check
  playerValue.innerHTML = playerPoints; // update points
  playerPoints > 21 ? renderPlayerBustMessage() : renderPlayerCards(); // goes over to dealer turn
}

function endPlay() {
  endPlay = true;
  turn = 1; // dealers turn
  dealBtn.style.visibility = 'visible';
  standBtn.style.visibility = 'hidden';
  hitBtn.style.visibility = 'hidden';
  newGameBtn.style.visibility = 'visible';
  enterBet.disabled = false; 
  message.innerHTML = 'Game Over';
  while (dealerPoints< 17) {
  renderDealerCards(); 
  check(dealerCards);
  }
  dealerPoints > 21 ? dealerBust(dealerPoints) : winningFormula(); // determine winner
}
  
function winningFormula() {
  (playerPoints === dealerPoints) ? (winner === 0)
  : (playerPoints < dealerPoints) ? (winner === 2) :  (winner === 1);
  renderWinMessage();
}

    function render() {
    renderHand(); 
    renderPlayerBustMessage();
    renderDealerBustMessage();
    renderWinMessage();
    renderDistribution();
    }

    function renderHand(){
       //two cards to the player
      renderPlayerCards();
      check(playerPoints);
      playerTotal(playerCards);
      softCheck(playerPoints);
      //two cards to the dealer
      renderDealerCards();
      check(dealerPoints);
      dealerTotal(dealerCards);  
      softCheck(dealerPoints); 
    }
    
    function renderPlayerCards() {
        createPlayerCards();
        playerSlot.innerHTML += `<div class="card ${cardValue[cardCount].face}"></div>`;
        createPlayerCards();
        playerSlot.innerHTML += `<div class="card ${cardValue[cardCount].face}"></div>`;
    }

    function renderDealerCards() {
      createDealerCards();
      dealerSlot.innerHTML += `<div class="card ${cardValue[cardCount].face}"></div>`;
      createDealerCards();
      dealerSlot.innerHTML += `<div class="card ${cardValue[cardCount].back}"></div>`;
    }

    function renderPlayerBustMessage(){
      if (playerPoints > 21) {
        message.innerHTML = `You've busted! $${enterBet.value} was subtracted to your chip total. Would you like to play again?`;
      }
    }

    function renderDealerBustMessage(){
      if (dealerPoints > 21) {
        message.innerHTML = `Dealer busted! $${enterBet.value} was added to your chip total. Would you like to play again?`;
      }
    }

    function renderWinMessage(){
      if (winner === 0) { // push
        message.innerHTML = `“You and the dealer have pushed. Your bet of ${enterBet.value} will neither be added or subtracted from your chip total. Would you like to play again?”`;
      } else if (winner === 1) { // player won
        message.innerHTML = `“You win! ${enterBet.value * 2} was added to your chip total. Would you like to play again?”`;    
      } else { // dealer wins
        message.textContent = `“You lose! ${enterBet.value} was already subtracted to your chip total at the beginning of play. Would you like to play again?”`;
      }
    }
    
    function renderDistribution(){
      if (winner === 0) { // push
        myDollars.innerHTML = parseInt(myDollars) + parseInt(enterBet.value);
      } else if (winner === 1) { // player won
        myDollars.innerHTML = parseInt(myDollars) + parseInt(enterBet.value * 2);
      } else { // dealer wins
        myDollars.innerHTML= myDollars;
      }
    }