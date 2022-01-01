// /*----- constants -----*/
// 1) Define required constants:

// 	1.1) Sound Constants
// 	1.2) Card Contants

const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

// 	1.3) CSS Constants


// /*----- app's state (variables) -----*/
	
// 2) Define required variables used to track the state of the game:

// 	2.2) Use a chipTotal variable to represent how much money (in chips) that the player has on the table and label “You Have:”. 
let chipTotal;
// 2.2.1) Cache the variable using “let” and set and display the chipTotal variable to $100.
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
// 


// /*----- cached element references -----*/
// 3) Store elements on the page that will be accessed in code more than once in variables to make code more concise, readable and performant:
// 	3.1) Store the Black Jack scoring system and build it into the winningFormula() function in Section 5. 
// 	3.1.1) The winner gets as close to 21 points as possible. The player or dealer that first goes over 21 loses the game.

// 	3.1.2) The value of cards
// 		3.1.2.1) Aces count as either 1 or 11 points.
// 3.1.2.2) Count cards from 2-10 ‘as-is’.
// 3.1.2.3) Count the K, Q, J cards as 10 points.
// 3.2) Put shuffledContainer into a variable.

const dealerSlot1 = document.querySelector('#dealerSlot1');
const dealerSlot2 = document.querySelector('#dealerSlot2');
const dealerSlot3 = document.querySelector('#dealerSlot3');
const dealerSlot4 = document.querySelector('#dealerSlot4');
const dealerSlot5 = document.querySelector('#dealerSlot5');
const playerSlot1 = document.querySelector('#playerSlot1');
const playerSlot2 = document.querySelector('#playerSlot2');
const playerSlot3 = document.querySelector('#playerSlot3');
const playerSlot4 = document.querySelector('#playerSlot4');
const playerSlot5 = document.querySelector('#playerSlot5');

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

// /*----- event listeners -----*/
// 3.3) Add all event listeners

hitBtn.addEventListener('click', handleHit);
// standBtn.addEventListener('click', handleStand);
newGameBtn.addEventListener('click', init);
button.addEventListener('click', renderNewShuffledDeck);

// /*----- functions -----*/


function init() {

  dealerCards = [];
  dealerCards.innerHTML = '';
  dealerCards.innerHTML = '';
  playerCards = [];
  handTotal = [];
  playerPoints = 0;
  dealerPoints = 0;
  safety = 17;
  chipTotal = 100;
  dealerStand = false;
  playerStand = false;
  turn = 0; // 0 for player, 1 for dealer
  deck = [];
  // remove newgame button and show hit/stay buttons
  // newGameBtn.classList.add('hidden');
  render();
}
// 4) Upon loading the app should:
// 	4.1) Initialize the state variables:
// 		4.1.1) Object contructor for a card for when making new cards




// 		4.1.2) Initialize the game area array with 5 card empty null slots for the dealer to represent empty card slots. The 5 elements will "map" to each slot in the dealer area, where index column 0, row 1 maps to the left slot and index 5 maps to the right slot. 

// 		4.1.3) Initialize the game area array with 5 card empty null slots for the player that represents empty card slots. The 5 elements will "map" to each slot under the player area, where index 0 maps to the left slot and index 5 maps to the right slot. 
// 		4.1.4) Set-up a “enter bet” input box with an enterBet variable in Section 5. Enter a default value of 10 in the input box.
// 			4.1.6.1) Restrict the “enter bet” to the chipTotal
// 4.1.5) Cache the input into an enterBet variable.
		






// 				4.2.1.1.2) 	Make the “New Game” button disappear while and after the cards are being dealt.


     // 4.1.2) Get a new Shuffled deck.

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
    // let cardsHtml = '';
    // deck.forEach(function(card) {
    //   cardsHtml += `<div class="card ${card.face}"></div>`;
    // });
    //Or, use reduce to 'reduce' the array into a single thing - in this case a string of HTML markup 
    const cardsHtml = deck.reduce(function(html, card) {
      return html + `<div class="card ${card.face}"></div>`;
    }, '');
    container.innerHTML = cardsHtml;
  }
  
  function buildMasterDeck() {
    let deck = [];
    // Use nested forEach to generate card objects
    suits.forEach(function(suit) {
      ranks.forEach(function(rank) {
        deck.push({
          // The 'face' property maps to the library's CSS classes for cards
          face: `${suit}${rank}`,
          // Setting the 'value' property for game of blackjack, not war
          value: Number(rank) || (rank === 'A' ? 11 : 10)
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


//If the cardsDealtSoFar Variable === 21, then the player automatically wins and invoke the winDistribution() function.
// 		The dealerPlay() function will add up the cards dealt so far by the dealer in a cardsDealtSoFar variable and makes sure the card total is less than 21. 
//  If (16 < cardsDealtSoFar < 21), the dealer will stop dealing cards and move to add up the dealer point total in the dealerPoints() function. 

// 	If (cardsDealtSoFar === 21) by dealer, the player automatically loses and go to the loseDistribution() function.
// 	If (cardsDealtSoFar > 21) by dealer, the player automatically wins and the winDistribution() is invoked
//  The playerPoints() function sums up the logic in 3.1.2 “value of cards” for the player card total and stores/caches in a create a playerTotal variable.  Invoke the dealerPoints() function
// 	The dealerPoints() function sums up the logic in 3.1.2 “value of cards” for the dealer card total and stores/caches in a create a dealerTotal variable. Invoke the winningFormula() function.
// 	

// deal two cards to the player 

function startGame () {
  newGameBtn.style.visibility = 'hidden';
  enterBet.style.visibility = 'hidden';
  const cardValue = shuffledDeck.pop();
  playerSlot1.innerHTML = `<div class="card ${cardValue.face}"></div>`;
  const cardValue1 = shuffledDeck.pop();
  playerSlot2.innerHTML = `<div class="card ${cardValue1.face}"></div>`;
  playerCards.push(cardValue);
  playerCards.push(cardValue1);
  const playerPoints = playerCards[0].value + playerCards[1].value;

// check for immediate player victory (if blackjack is hit off the bat)

if (playerPoints === 21 && dealerPoints !== 21) {
    chipFinal = chipTotal + parseInt(enterBet.value);
    console.log(chipFinal);
    turn = 1; // to cause the dealer's hand to be drawn face up;
  } 
    
  //two cards to the dealer
  const cardValue2 = shuffledDeck.pop();
  dealerSlot1.innerHTML = `<div class="card ${cardValue2.face}"></div>`;
  const cardValue3 = shuffledDeck.pop();
  dealerSlot2.innerHTML = `<div class="card ${cardValue3.back}"></div>`;
  dealerCards.push(cardValue2);
  dealerCards.push(cardValue3);
  const dealerPoints = dealerCards[0].value + dealerCards[1].value;

 // // check for immediate dealer victory (if blackjack is hit off the bat)
  
  if (dealerPoints === 21 & playerPoints !== 21) {
    chipFinal = chipTotal - parseInt(enterBet.value);
    turn = 1; // to cause the dealer's hand to be drawn face up
    return lose(chipFinal);
  }

  // if both hit black jack (never happens lol)

  if (dealerPoints === 21 && playerPoints === 21) {
    turn = 1; /// to cause the dealer's hand to be drawn face up
    return push();
  }

  // if player is less than 21

  if (playerPoints < 21) {
    hitStandMsg(playerPoints);
    return playerPoints && dealerPoints && chipFinal;
  }
} 


function hitStandMsg(playerPoints) {
  message.innerText = `You have ${playerPoints}. Hit or Stand?`;
}
// if player clicks the hit button
function handleHit() {
  const cardValue4 = shuffledDeck.pop();
  playerSlot3.innerHTML = `<div class="card ${cardValue4.face}"></div>`;
  playerCards.push(cardValue4);
  playerPoints = playerCards[0].value + playerCards[1].value + playerCards[2].value;  
  //If the playerPoints > 21, then invoke the Bust() function.
  check(playerPoints);
  if (playerPoints < 21) {
    // Display the hitStandMsg().
    message.innerText = `You have ${playerPoints}. Hit or Stand?`;
    hitBtn.addEventListener('click', handleHit4thCol);
  }
}

function handleHit4thCol() {
  const cardValue5 = shuffledDeck.pop();
  playerSlot4.innerHTML = `<div class="card ${cardValue5.face}"></div>`;
  playerCards.push(cardValue5);
  playerPoints = playerCards[0].value + playerCards[1].value + playerCards[2].value + playerCards[3].value;
  
  //If the playerPoints > 21, then invoke the Bust() function.
  check(playerPoints);
  if (playerPoints < 21) {
    // Display the hitStandMsg().
    message.innerText = `You have ${playerPoints}. Hit or Stand?`;
    hitBtn.addEventListener('click', handleHit4thCol);
  }
}

function handleHitFinalCol() {
  const cardValue6 = shuffledDeck.pop();
  playerSlot4.innerHTML = `<div class="card ${cardValue6.face}"></div>`;
  playerCards.push(cardValue6);
  playerPoints = playerCards[0].value + playerCards[1].value + playerCards[2].value + playerCards[3].value + playerCards[4].value;
  
  //If the playerPoints > 21, then invoke the Bust() function.
  check();
  if (playerPoints < 21) {
    // Display the hitStandMsg().
    hitStandMsg();
  }
}

// 	
//5.6) Set the winner variable if there's a winner in the winningFormula() function:
// 		5.6.1) If (playerPoints > dealerPoints), the player wins and invoke the winDistribution()functions.

  // 		If (playerPoints < dealerPoints), the dealer wins and invoke the lose() function.

// The Stand() function is invoked after the player clicks the “stand” button. The Stand() function initiates a playerPoints() and dealerPlay() for the dealer.



// 				After the player is done getting cards (stand), remove the “hit” and “stand” buttons… add player points in the playerPoints() function. 

// 			 Dealer either adds cards or stands (if equal to safety value of  17). After the dealer is done getting cards (push), add up the dealer points in the dealerPoints() function.




  


// The Stand() function is invoked after the player clicks the “stand” button. The Stand() function initiates a playerPoints() and dealerPlay() for the dealer.



function check(playerPoints) {
  if (playerPoints > 21) {
    bust(playerPoints);
  }
}

  // 		Add the chipTotal and parseInt numerical version of the enterBet value for the winDistribution()
  function winDistribution(chipTotal) {
    chipFinal = chipTotal + parseInt(enterBet.value);
  }
  // 		Subtract parseInt numerical version of the enterBet value from the chipTotal for the loseDistribution()
  function loseDistribution(chipTotal) {
    chipFinal = chipTotal - parseInt(enterBet.value);
  }

// 	 If (playerPoints = dealerPoints), the player and dealer push and invoke the pushDistribution() function.
  function pushDistribution(chipTotal) {
    chipFinal = chipTotal;
  }

// 		If (chipTotal - enterBet < 0), the player has gone broke and invoke the goneBrokeMsg();

// 6) Win, lose, gone broke or push messages:
//	The winMsg() returns “You win! ${enterBet} was added to your chip total. Would you like to play again?”
// Display the “new game” button
    function win( ) {
      winDistribution();
      newGameBtn.style.visibility = 'visible';
      enterBet.style.visibility = 'visible';
      return `“You win! ${enterBet} was added to your chip total. Would you like to play again?”`;    
    }

// 		The loseMsg() returns “You lose! ${enterBet} was subtracted to your chip total. Would you like to play again?”
//  Display the “new game” button
    function lose(){
      loseDistribution();
      newGameBtn.style.visibility = 'visible';
      enterBet.style.visibility = 'visible';
      return `“You lose! ${enterBet} was subtracted to your chip total. Would you like to play again?”`;
    } 

// 	
// 	 The goneBrokeMsg() returns “Oh boy! You’ve gone broke, sucker!! The game is now over.”
// 		Keep the “new game” button frozen and freeze out the enterBet input box with “BUSTED” as the text input.

// 	The pushMsg() returns “You and the dealer have pushed. Your bet of ${enterBet} will neither be added or subtracted from your chip total. Would you like to play again?”
// 	Display the “new game” button
    function push() {
      pushDistribution();
      newGameBtn.style.visibility = 'visible';
      enterBet.style.visibility = 'visible';
      return `“You and the dealer have pushed. Your bet of ${enterBet} will neither be added or subtracted from your chip total. Would you like to play again?”`;
    }

// If playerPoints > 21 || dealerPoints > 21, add the bust function

    function bust(playerPoints) {
      if (playerPoints > 21) {
        lose();
      } else if (dealerPoints > 21) {
        win();
      }
    }