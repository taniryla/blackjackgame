// /*----- constants -----*/
// 1) Define required constants:

// 	1.1) Sound Constants
// 	1.2) Card Contants

const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

// 	1.3) CSS Constants


// /*----- app's state (variables) -----*/
	
// 2) Define required variables used to track the state of the game:
// 2.1) Create an aceFlag variable so that for each Ace in your hand add 10 if it doesn't cause you to bust
let aceFlag;

// 2.2.1) Create a cardCount variable for each new card added from shuffleDeck
let cardCount;
// 2.3) Create an empty array of player cards
let playerCards;
// 	2.4) Create an empty array of dealerCards.
let dealerCards;
// 	2.5) Create an empty array of the deck.
let deck;
// 	2.6) Set-up playerPoints and initialize as 0.
let playerPoints;
// 	2.7) Set-up dealerPoints and initialize as 0.
let dealerPoints;
// 	2.8) Declare a Shuffle deck variable.
let shuffledDeck;
// Determine what safety number that dealer will stand on or past this point
let safety;
// declare if the dealer has stood (true or false)
let dealerStand;
// declare if the player has stood (true or false)
let playerStand;
// whose turn is it? 0 for player, 1 for dealer, 2 for game over
let turn;
 // if endPlay = true, the game is over



// /*----- cached element references -----*/
// 3) Store elements on the page that will be accessed in code more than once in variables to make code more concise, readable and performant:
// 	3.1) Store the Black Jack scoring system and build it into the winningFormula() function in Section 5. 
// 	3.1.1) The winner gets as close to 21 points as possible. The player or dealer that first goes over 21 loses the game.

// 	3.1.2) The value of cards
// 		3.1.2.1) Aces count as either 1 or 11 points.
// 3.1.2.2) Count cards from 2-10 ‘as-is’.
// 3.1.2.3) Count the K, Q, J cards as 10 points.
// 3.2) Put shuffledContainer into a variable.

let dealerSlot = document.querySelector('#dealerSlot');
let dealerSlot0 = document.querySelector('#dealerSlot0');
let dealerSlot1 = document.querySelector('#dealerSlot1');
let playerSlot = document.querySelector('#playerSlot');
let playerSlot0 = document.querySelector('#playerSlot0');
let playerSlot1 = document.querySelector('#playerSlot1');

const hitBtn = document.querySelector('#hitBtn');
const standBtn = document.querySelector('#standBtn');
const newGameBtn = document.querySelector('#newGameBtn');
const newShuffledDeck = document.querySelector('#newShuffledDeck');
const masterDeckContainer = document.getElementById('master-deck-container');
const button = document.querySelector('button');
const shuffledContainer = document.getElementById('shuffled-deck-container');
let enterBet = document.querySelector('#enterBet');
let chipFinal = document.querySelector('#chipFinal');
let message = document.querySelector('#message');
let dealBtn = document.querySelector('#dealBtn');

// /*----- event listeners -----*/
// 3.3) Add all event listeners

hitBtn.addEventListener('click', handleHit);
standBtn.addEventListener('click', endPlay);
newGameBtn.addEventListener('click', startNewGame);
button.addEventListener('click', renderNewShuffledDeck);
dealBtn.addEventListener('click', init)


// /*----- functions -----*/
function startNewGame() {
  dealBtn.style.visibility = 'visible';
  newGameBtn.style.visibility = 'hidden';
  enterBet.disabled = true; 
  standBtn.style.visibility = 'hidden';
  hitBtn.style.visibility = 'hidden';
}

function init() {
  dealBtn.style.visibility = 'hidden';
  standBtn.style.visibility = 'visible';
  hitBtn.style.visibility = 'visible';
  dealerCards = [];
  playerCards = [];
  cardValue = [];
  cardCount = 0;
  dealerSlot = [];
  playerSlot = [];
  endPlay = false;
  let myDollars = document.querySelector('#dollars').innerHTML;
  myDollars = myDollars - parseInt(enterBet.value);
  document.querySelector('#dollars').innerHTML = myDollars;
  handTotal = [];
  playerPoints = 0;
  dealerPoints = 0;
  safety = 17;
  dealerStand = false; 
  playerStand = false;
  turn = 0; // 0 for player, 1 for dealer
  deck = [];
  // remove newgame button and show hit/stay buttons
  // newGameBtn.classList.add('hidden');
  render();
}

     // Get a new Shuffled deck.

  const masterDeck = buildMasterDeck();
  renderDeckInContainer(masterDeck, masterDeckContainer);


  function getNewShuffledDeck() {
    // Create a copy of the masterDeck (leave masterDeck untouched!)
    const tempDeck = [...masterDeck];
    const newShuffledDeck = [];
    while (tempDeck.length) {
      // Get a random index for a card still in the tempDeck
      const rndIdx = Math.floor(Math.random() * tempDeck.length);
      // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
      newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    }
    return newShuffledDeck;
  }
  
  function renderNewShuffledDeck() {
    // Create a copy of the masterDeck (leave masterDeck untouched!)
    shuffledDeck = getNewShuffledDeck();
    renderDeckInContainer(shuffledDeck, shuffledContainer);
  }

  
  
  function renderDeckInContainer(deck, container) {
    container.innerHTML = '';
    // Let's build the cards as a string of HTML
    // use reduce to 'reduce' the array into a single thing - in this case a string of HTML markup 
    const cardsHtml = deck.reduce(function(html, card) {
      return html + `<div class="card ${card.face}"></div>`;
    }, '');
    container.innerHTML = cardsHtml;
  }
  
  function buildMasterDeck() {
    let deck = [];
    aceFactor = 0; // reset the number of aces to zero
    // Use nested forEach to generate card objects
    suits.forEach(function(suit) {
      ranks.forEach(function(rank) {
        deck.push({
          // The 'face' property maps to the library's CSS classes for cards
          face: `${suit}${rank}`,
          // Setting the 'value' property for game of blackjack, not war
          value: Number(rank) || (rank === 'A' ? 1 : 10)
        });
      });
    });
    return deck;
  }
  
  renderNewShuffledDeck();


// 	Render those state variables to the page:
// 		Render the game:
// 			Run the renderNewShuffleDeck() function that shuffles the deck of 52 cards:
function render() {
    startGame();
}

function startGame() {
  newGameBtn.style.visibility = 'hidden';
  enterBet.style.visibility = 'hidden';
  cardValue[cardCount]= shuffledDeck.pop();
  playerSlot0.innerHTML = `<div class="card ${cardValue[cardCount].face}"></div>`;
  playerCards.push(cardValue[cardCount]);
  cardValue[cardCount] = shuffledDeck.pop();
  playerSlot1.innerHTML = `<div class="card ${cardValue[cardCount].face}"></div>`;
  playerCards.push(cardValue[cardCount]);
  playerPoints = playerCards[0].value + playerCards[1].value;
  playerValue.innerHTML = playerPoints;
  softCheck(playerPoints);

  //two cards to the dealer
  cardValue[cardCount] = shuffledDeck.pop();
  dealerSlot0.innerHTML += `<div class="card ${cardValue[cardCount].face}"></div>`;
  dealerCards.push(cardValue[cardCount]);
  cardValue[cardCount] = shuffledDeck.pop();
  dealerSlot1.innerHTML = `<div class="card ${cardValue[cardCount].back}"></div>`;
  dealerCards.push(cardValue[cardCount]);
  dealerPoints = dealerCards[0].value + dealerCards[1].value;
  softCheck(dealerPoints);
}

// check for immediate player victory (if blackjack is hit off the bat)
function softCheck (arr) {
  check(arr);
  (dealerPoints === 21 && playerPoints === 21) ? push() 
  : (playerPoints === 21 && dealerPoints !== 21) ?  win() 
  : (dealerPoints === 21 & playerPoints !== 21) ? lose() 
  : message.innerText = `You have ${playerPoints}. Hit or Stand?`; 
}

// attempting to refactor my hit and stand functions to generalize

function handleHit(){
  renderPlayerHit();  // render new player cards
  playerPoints = check(playerCards); // account for the ace dual value and bust check
  playerValue.innerHTML = playerPoints; // update points
  playerPoints > 21 ? playerBust(playerPoints) : winningFormula(); // determine winner
}

function renderPlayerHit() {
  cardValue[cardCount] = shuffledDeck.pop();
  playerCards.push(cardValue[cardCount]);
  playerSlot.innerHTML += `<div class="card ${cardValue[cardCount].face}"></div>`;
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

function endPlay() {
  endPlay = true;
  turn = 1; // dealers turn

  dealBtn.style.visibility = 'visible';
  standBtn.style.visibility = 'hidden';
  hitBtn.style.visibility = 'hidden';
  newGameBtn.style.visibility = 'visible';
  enterBet.disabled = false; 
  message.innerHTML = 'Game Over';

 dealerPoints = check(dealerCards);
  dealerValue.innerHTML = dealerPoints;
  renderDealerCards(); 
  dealerPoints = check(dealerCards);
  dealerValue.innerHTML = dealerPoints; 
  dealerPoints > 21 ? dealerBust(dealerPoints) : winningFormula();
}

  function renderDealerCards(){
    while (dealerPoints< 17) { // to determine if we keep sending dealer cards
    cardValue[cardCount] = shuffledDeck.pop();
    dealerSlot.innerHTML += `<div class="card ${cardValue[cardCount].face}"></div>`;
    dealerCards.push(cardValue[cardCount]);
    cardCount++;
  }
}
// // if player clicks the hit button
// function handleHit() {
//   const cardValue4 = shuffledDeck.pop();
//   playerSlot3.innerHTML = `<div class="card ${cardValue4.face}"></div>`;
//   playerCards.push(cardValue4);
//   // aceFactor(cards);
//   playerPoints = playerCards[0].value + playerCards[1].value + playerCards[2].value;  
//   //If the playerPoints > 21, then invoke the playerBust() function.
//   playerCheck(playerPoints);
//   if (playerPoints < 21) {
//     message.innerText = `You have ${playerPoints}. Hit or Stand?`;
//     hitBtn.addEventListener('click', handleHit4thCard);
//   }
// }

// function handleHit4thCard() {
//   const cardValue5 = shuffledDeck.pop();
//   playerSlot4.innerHTML = `<div class="card ${cardValue5.face}"></div>`;
//   playerCards.push(cardValue5);
//   // aceFactor(cards);
//   playerPoints = playerCards[0].value + playerCards[1].value + playerCards[2].value + playerCards[3].value;
  
//   //If the playerPoints > 21, then invoke the Bust() function.
//   playerCheck(playerPoints);
//   if (playerPoints < 21) {
//     message.innerText = `You have ${playerPoints}. Hit or Stand?`;
//     hitBtn.addEventListener('click', handleHitFinal);
//   }
// }

// function handleHitFinal() {
//   const cardValue6 = shuffledDeck.pop();
//   playerSlot5.innerHTML = `<div class="card ${cardValue6.face}"></div>`;
//   playerCards.push(cardValue6);
//   // aceFactor(cards);
//   playerPoints = playerCards[0].value + playerCards[1].value + playerCards[2].value + playerCards[3].value + playerCards[4].value;
// }
//   //If the playerPoints > 21, then invoke the playerBust() function.
//   playerCheck(playerPoints);
//   (playerPoints > 21) ? playerBust() : handleStand();
//     // Now it's the dealer's turn

//     //If the dealerPoints > 21, then invoke the dealerBust() function.
//   dealerCheck(dealerPoints);
//   (dealerPoints > 21) ? dealerBust() : handleStand();


// function handleStand() {
//   standBtn.style.visibility = 'visible';
//   hitBtn.style.visibility = 'visible';
//   turn = 1; // dealer's turn
//   message.innerText = 'Dealer plays';
//   (dealerPoints < 17) 
//   ?
//   const cardValue7 = shuffledDeck.pop();
//   dealerSlot3.innerHTML = `<div class="card ${cardValue7.face}"></div>`;
//   dealerCards.push(cardValue7);
//   // aceFactor(cards);
//   dealerPoints = dealerCards[0].value + dealerCards[1].value + dealerCards[2].value;
//   document.querySelector('#dealerValue').innerHTML = dealerPoints;
//   : dealer4thCheck(dealerPoints);
// }
// }

// function dealer4thCard() {
//     if (dealerPoints < 17) {
//     const cardValue8 = shuffledDeck.pop();
//     dealerSlot4.innerHTML = `<div class="card ${cardValue8.face}"></div>`; 
//     dealerCards.push(cardValue8);
//     // aceFactor(cards);
//     dealerPoints = dealerCards[0].value + dealerCards[1].value + dealerCards[2].value + dealerCards[3].value;
//     document.querySelector('#dealerValue').innerHTML = dealerPoints;
//     dealerFinalCheck(dealerPoints);
//     if (dealerPoints >= 17) {
//       winningFormula(playerPoints, dealerPoints);
//     } 
//    }
//   }
  
// function dealerFinalCard() {
//     if (dealerPoints >= 17) {
//     winningFormula(playerPoints, dealerPoints);
//   } if (dealerPoints < 17) {
//     const cardValue9 = shuffledDeck.pop();
//     dealerSlot5.innerHTML = `<div class="card ${cardValue9.face}"></div>`; 
//     dealerCards.push(cardValue9);
//     // aceFactor(cards);
//     dealerPoints = dealerCards[0].value + dealerCards[1].value + dealerCards[2].value + dealerCards[3].value + dealerCards[4].value;
//     document.querySelector('#dealerValue').innerHTML = dealerPoints;
//     winningFormula(playerPoints, dealerPoints);
//   }
// }
// // check the hand total and add value if ace doesn't cause a bust
// function handTotal (cards) {
//   let total = 0; 
//   aceFlag = 0;// track the number of aces in hand
//   for (let i = 0; i < cards.length; i++) {
//     total += cards[i].value;
//     if(cards[i].value === 1) {
//       aceFlag += 1;
//     }
//   }
// } 
//   // for each ace we have in our hand, add 10 points if doing so won't cause a bust
// for (let j = 0; j < aceFlag; j++) {
//   if (total + 10 <= 21) {
//     total += 10;
//   }
//   console.log(total);
//   return total;
// }

  
// The Stand() function is invoked after the player clicks the “stand” button. The Stand() function initiates a playerPoints() and dealerPlay() for the dealer.
// Set the winner variable if there's a winner in the winningFormula() function:
// 		 If (playerPoints > dealerPoints), the player wins and invoke the winDistribution()functions.
  // 		If (playerPoints < dealerPoints), the dealer wins and invoke the lose() function.
// 				After the player is done getting cards (stand), remove the “hit” and “stand” buttons… add player points in the playerPoints() function. 
// 			 Dealer either adds cards or stands (if equal to safety value of  17). After the dealer is done getting cards (push), add up the dealer points in the dealerPoints() function.

function winningFormula(playerPoints, dealerPoints) {
  if (playerPoints === dealerPoints) {
    push();
  }
    playerPoints < dealerPoints ? lose() :  win();
}

// The Stand() function is invoked after the player clicks the “stand” button. The Stand() function initiates a playerPoints() and dealerPlay() for the dealer.

  function playerCheck(playerPoints) {
    if (playerPoints > 21) {
      playerBust(playerPoints);
    }
  }

  function dealerCheck(dealerPoints) {
    (dealerPoints > 21) ? dealerBust(dealerPoints) : handleStand();
  }

  function dealer4thCheck(dealerPoints) {
    (dealerPoints > 21) ? dealerBust(dealerPoints) : dealer4thCard();
    }

  function dealerFinalCheck(dealerPoints) {
    (dealerPoints > 21) ? dealerBust(dealerPoints) : dealerFinalCard();
    }

  // 		Add the chipTotal and parseInt numerical version of the enterBet value for the winDistribution()
  function winDistribution() {
      myDollars = document.querySelector('#dollars');
      myDollars.innerHTML = parseInt(myDollars) + parseInt(enterBet.value * 2);
  }
  // 		Subtract parseInt numerical version of the enterBet value from the chipTotal for the loseDistribution()
  function loseDistribution() {
      myDollars = document.querySelector('#dollars');
      myDollars.innerHTML= myDollars;
  }

// 	 If (playerPoints = dealerPoints), the player and dealer push and invoke the pushDistribution() function.
  function pushDistribution( ) {
    myDollars = document.querySelector('#dollars');
    myDollars.innerHTML = parseInt(myDollars) + parseInt(enterBet.value);
  }

// 		If (chipTotal - enterBet < 0), the player has gone broke and invoke the goneBrokeMsg();

// 6) Win, lose, gone broke or push messages:
//	The winMsg() returns “You win! ${enterBet} was added to your chip total. Would you like to play again?”
// Display the “new game” button
    function win( ) {
      winDistribution();
      message.innerHTML = `“You win! ${enterBet.value * 2} was added to your chip total. Would you like to play again?”`;    
    }

// 		The loseMsg() returns “You lose! ${enterBet} was subtracted to your chip total. Would you like to play again?”
//  Display the “new game” button
    function lose( ){
      loseDistribution();
      message.textContent = `“You lose! ${enterBet.value} was already subtracted to your chip total at the beginning of play. Would you like to play again?”`;
    } 

// 	
// 	 The goneBrokeMsg() returns “Oh boy! You’ve gone broke, sucker!! The game is now over.”
// 		Keep the “new game” button frozen and freeze out the enterBet input box with “BUSTED” as the text input.

// 	The pushMsg() returns “You and the dealer have pushed. Your bet of ${enterBet} will neither be added or subtracted from your chip total. Would you like to play again?”
// 	Display the “new game” button
    function push() {
      pushDistribution();
      message.innerHTML = `“You and the dealer have pushed. Your bet of ${enterBet.value} will neither be added or subtracted from your chip total. Would you like to play again?”`;
    }

// If playerPoints > 21 || dealerPoints > 21, add the bust function

    function playerBust(playerPoints) {
      if (playerPoints > 21) {
        lose();
        message.innerHTML = `You've busted! ${enterBet.value} was subtracted to your chip total. Would you like to play again?`;
      } 
        win();
    }
    
    function dealerBust(dealerPoints) {
    if (dealerPoints > 21) {
        win();
        message.innerHTML = `Dealer busted! ${enterBet.value} was added to your chip total. Would you like to play again?`;
      } 
    }
