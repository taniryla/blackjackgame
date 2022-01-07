// /*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

// /*----- app's state (variables) -----*/
let playerCards;
let dealerCards;
let deck;
let playerPoints;
let dealerPoints;
let shuffledDeck;
let turn; // whose turn is it? 0 for player, 1 for dealer, 2 for game over
let cardCount;
let cardValue;
let myDollars; // myDollars tracks how much money in the chipFinal tag
let winner; // winner tracks 2 : computer won, 1 : player won, 0 : push

// /*----- cached element references -----*/
let dealerSlot = document.querySelector('#dealerSlot');
let playerSlot = document.querySelector('#playerSlot');
let playerValue = document.querySelector('#playerValue');
let dealerValue = document.querySelector('#dealerValue');
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
let dollars = document.querySelector('#dollars');

// /*----- event listeners -----*/
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
function init() { // deal new deck of shuffled card
    renderInitBtn();
    playerCards = [];
    dealerCards = [];
    deck = [];
    myDollars = 100;
    playerPoints = 0;
    dealerPoints = 0;
    cardCount = 0;
    cardValue = [];
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

// update all impacted state in variables, then call render... don't use the DOM to hold state


function check(arr) {
    let total = 0;
    aceFlag = false;
    for (let i in arr) {
        if (arr[i].ranks === 'A' && !aceFlag) {
            aceFlag = true;
            console.log(aceFlag);
            total = total + 10;
        }
        total = total + arr[i].value;
    }
    if (aceFlag && total > 21) {
        total = total - 10;
    }
    return total;
}

function playerTotal() {
    for (let i = 0; i < playerCards.length; i++) {
        playerPoints += playerCards[i].value;
    }
}

function softCheck(arr) {
    if (dealerPoints === 21 && playerPoints === 21) {
        winner = 0;
    } else if (playerPoints === 21 && dealerPoints !== 21) {
        winner = 1;
    } else if (dealerPoints === 21 & playerPoints !== 21) {
        winner = 2;
    }
    renderWinMessage();
}

function dealerTotal() {
    for (let i = 0; i < dealerCards.length; i++) {
        dealerPoints += dealerCards[i].value;
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
    renderNewShuffledDeck();
    renderDeckInContainer(shuffledDeck, shuffledContainer);
    renderDeal()
    renderPlayerValue();
    renderDealerValue();
    renderInitBtn();
}

function renderInitBtn() {
    dealBtn.style.visibility = 'hidden';
    standBtn.style.visibility = 'visible';
    hitBtn.style.visibility = 'visible';
    newGameBtn.style.visibility = 'hidden';
    message.innerText = `You have ${playerPoints}. Hit or Stand?`;
}

function renderPlayerValue() {
    playerValue.innerHTML = playerPoints;
}

function renderDealerValue() {
    dealerValue.innerHTML = dealerPoints;
}

function renderNewGame() {
    dealBtn.style.visibility = 'visible';
    standBtn.style.visibility = 'hidden';
    hitBtn.style.visibility = 'hidden';
    newGameBtn.style.visibility = 'visible';
    enterBet.disabled = false;
    message.innerHTML = 'Game Over';
}

function renderDeal() {
    for (let i = 0; i < 2; i++) {
        playerCards.push(shuffledDeck.pop());
        playerSlot.innerHTML += `<div class="card ${playerCards[i].face}"></div>`;
        dealerCards.push(shuffledDeck.pop());
        dealerSlot.innerHTML += `<div class="card ${dealerCards[i].face}"></div>`;
    }
    softCheck(playerCards);
    playerTotal();
    dealerTotal();
    myDollars = myDollars - parseInt(enterBet.value);
    dollars.innerText = myDollars;
}

function renderHitCard() {
    for (let i = 2; i < playerCards.length; i++) {
        playerCards.push(shuffledDeck.pop());
        playerSlot.innerHTML += `<div class="card ${playerCards[i].face}"></div>`;
    }
    playerTotal();
}

function renderDealerPlayout() {
    for (let i = 2; i < dealerCards.length; i++) {
        dealerCards.push(shuffledDeck.pop());
        dealerSlot.innerHTML += `<div class="card ${dealerCards[i].face}"></div>`;
        dealerTotal(dealerCards);
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

function renderDistribution() {
    if (winner === 0) { // push
        myDollars.innerHTML = parseInt(myDollars) + parseInt(enterBet.value);
    } else if (winner === 1) { // player won
        myDollars.innerHTML = parseInt(myDollars) + parseInt(enterBet.value * 2);
    } else { // dealer wins
        myDollars.innerHTML = myDollars;
    }
    renderNewGame();
}