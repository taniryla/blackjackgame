const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const masterDeck = buildMasterDeck();

let playerCards;
let dealerCards;
let playerPoints;
let dealerPoints;

const hitBtn = document.querySelector('#hitBtn');
const standBtn = document.querySelector('#standBtn');
const dealBtn = document.querySelector('#dealBtn');
const enterBet = document.querySelector('#enterBet');
const message = document.querySelector('#message');
const betBtn = document.querySelector('#betBtn');
dollars = document.querySelector('#dollars');

hitBtn.addEventListener('click', handleHit);
standBtn.addEventListener('click', handleStand);
dealBtn.addEventListener('click', handleDeal);
betBtn.addEventListener('click', handleSetBet);
enterBet.addEventListener('change', render);

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
        myDollars -= wager;
    }
    render();
}

function blackJackCheck() {
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

function init() {
    playerCards = [];
    dealerCards = [];
    myDollars = 100;
    render();
}

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
    suits.forEach(function(suit) {
        ranks.forEach(function(rank) {
            deck.push({
                face: `${suit}${rank}`,
            });
        });
    });
    return deck;
}

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
        winner = 'L';
        wager = 0;
    }
    render();
}

function handleStand() {
    while (dealerPoints < 17) {
        dealerCards.push(deck.pop());
        dealerPoints = computePoints(dealerCards);
    }
    if (playerPoints === dealerPoints) {
        winner = 'T';
        myDollars += wager;
        wager = 0;
    } else if (dealerPoints > 21) {
        winner = 'W';
        myDollars += wager * 2;
        wager = 0;
    } else if (playerPoints < dealerPoints && dealerPoints <= 21) {
        winner = 'L';
        wager = 0;
    } else if (playerPoints > dealerPoints && playerPoints <= 21) {
        winner = 'W';
        myDollars += wager * 2;
        wager = 0;
    }
    render();
};

function render() {
    const handInProgress = !winner && playerCards.length;
    dealBtn.style.visibility = handInProgress || !wager ? 'hidden' : 'visible';
    standBtn.style.visibility = handInProgress ? 'visible' : 'hidden';
    hitBtn.style.visibility = handInProgress ? 'visible' : 'hidden';
    enterBet.disabled = handInProgress;
    dollars.innerHTML = myDollars;
    betBtn.disabled = wager > 0;
    renderHands();
    handInProgress ? message.innerHTML = `You have ${playerPoints}. Hit or Stand?` :
        message.innerHTML = 'Enter your bet + click the "Set Bet" button';
    renderMessage();
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
        const cardClass = handInProgress && idx === 0 ? 'back-red' : card.face;
        html += `<div class="card ${cardClass}"></div>`;
    });
    dealerSlot.innerHTML = html;
    if (!handInProgress) {
        dealerValue.innerHTML = dealerPoints;
    }
    dealerValue.innerHTML = '';
}

function renderMessage() {
    if (winner === 'T') {
        message.innerHTML = `“You and the dealer have pushed. You have ${playerPoints} and the dealer has ${dealerPoints}. Your bet of $${enterBet.value} will neither be added nor subtracted from your chip total. Would you like to play again? Click on SET BET.”`;
    } else if (winner === 'PBJ') {
        message.innerHTML = `“You win a black jack! $${Math.floor(parseInt(enterBet.value) * 1.5)} was added to your chip total. Would you like to play again? Click on SET BET.”`;
    } else if (winner === 'DBJ') {
        message.textContent = `“You lose to the dealer's black jack! $${enterBet.value} was already subtracted to your chip total at the beginning of play. Would you like to play again? Click on SET BET.”`;
    } else if (winner === 'W') {
        message.innerHTML = `“You win! You have ${playerPoints} and the dealer has ${dealerPoints}. $${enterBet.value} was added to your chip total. Would you like to play again? Click on SET BET.”`;
    } else if (winner === 'L') {
        message.textContent = `“You lose! You have ${playerPoints} and the dealer has ${dealerPoints}. $${enterBet.value} was already subtracted to your chip total at the beginning of play. Would you like to play again? Click on SET BET.”`;
    }
}