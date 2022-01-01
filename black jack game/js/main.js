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
const enterBet = document.querySelector('#enterBet');

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
  newGameBtn.classList.add('hidden');
  const cardValue = shuffledDeck.pop();
  playerSlot1.innerHTML = `<div class="card ${cardValue.face}"></div>`;
  const cardValue1 = shuffledDeck.pop();
  playerSlot2.innerHTML = `<div class="card ${cardValue1.face}"></div>`;
  playerCards.push(cardValue);
  playerCards.push(cardValue1);
  const playerPoints = playerCards[0].value + playerCards[1].value;
  console.log(playerPoints);

// check for immediate player victory (if blackjack is hit off the bat)

if (playerPoints === 21) {
    chipTotal = parseInt(chipTotal) + parseInt(enterBet.value);
    console.log(chipTotal);
    turn = 1; // to cause the dealer's hand to be drawn face up
    win(chipTotal)
  } 
    
  //two cards to the dealer
  const cardValue2 = shuffledDeck.pop();
  dealerSlot1.innerHTML = `<div class="card ${cardValue2.face}"></div>`;
  const cardValue3 = shuffledDeck.pop();
  dealerSlot2.innerHTML = `<div class="card ${cardValue3.back}"></div>`;
  dealerCards.push(cardValue2);
  dealerCards.push(cardValue3);
  const dealerPoints = dealerCards[0].value + dealerCards[1].value;
  console.log(dealerPoints);

 // // check for immediate dealer victory (if blackjack is hit off the bat)
  
  if (dealerPoints === 21) {
    chipTotal = chipTotal - enterBet.value;
    turn = 1; // to cause the dealer's hand to be drawn face up
    lose(chipTotal);
  }

} 
 
  
 
  
  
  
 
  
  // draw the hands if neither got blackjack off the bat
  newGameBtn.classList.remove('hidden');
  pushMsg();



// const updatePoints = function() {
//      const playerTotal = handTotal(playerCards);
//      const dealerTotal = handTotal(dealerCards);
//      
//     }

// The Stand() function is invoked after the player clicks the “stand” button. The Stand() function initiates a playerPoints() and dealerPlay() for the dealer.

// 			4.2.1.1.3) The player chooses to “Hit” or “Stand”. Display the message from a hitStandMsg() function, “You have ${number}. Hit or Stand?”

// must tally up the updatePoints


function hitStandMsg() {
  return `“You have ${number}. Hit or Stand?”`;
}

// 
function handleHit () {

}

function handleStand() {

}

function check() {
  if (playerPoints > 21) {
    bustMsg();
  }
}

// The Stand() function is invoked after the player clicks the “stand” button. The Stand() function initiates a playerPoints() and dealerPlay() for the dealer.



      

// 				4.2.1.1.4) The Hit function gives the player another card as detailed in the Hit() function section 5 of this pseudocode.
// 				4.2.1.1.5) The Stand function means the player is finished getting cards as detailed in the Stand() function section 5 of this pseudocode. 
// 				4.2.1.1.6) After the player is done getting cards (push or bust), remove the “hit” and “stand” buttons… add player points in the playerPoints() function. 

// 				4.2.1.1.7) Dealer either adds cards or stands (is finished). After the dealer is done getting cards (push), add up the dealer points in the dealerPoints() function.

// 				4.2.1.1.8) Compute a winner by calculating if a player or dealer has the winning score by running the winningFormula() in section 5.  Whoever between the dealer and player has the higher score is the winner. Winner will hold a push if there's a tie. 
// 				4.3.1.1.9) Or Compute if the dealer and player have a push (tie).
// 4.3.1.1.10) If the player is a winner, add the money into the winner’s account by the amount on the enterBet variable.
// 				4.3.1.1.11) If the player is a loser, subtract the money into the winner’s account by the amount on the enterBet variable.
// 				4.3.1.1.12) If it’s a push, no money gets added or subtracted goes into the money into the winner’s account by the amount on the enterBet variable.
// 		4.2.2) Render a message:
// 			4.2.2.1) If winner is equal to push (tie), render a push message. “It’s a push. Neither you nor the dealer won. Let’s play again.”
// 			4.2.2.2) Otherwise, render a congratulatory message to which player has won, “Congratulations! You won ${bet} and it has been added to your chip stack. Let’s play again.”
// 4.2.2.3) Render a message, “Dealer won! You’ve lost ${bet}. Let’s play again.”
// 	4.3) Wait for the user to click on ‘new game” to invoke the newGame() function.

// 5) Black jack game functions:
// 	5.1) After the initial deal of 2 cards to player and 2 cards to dealer, the renderCard() function will deal a single new card to either the player or the dealer depending on whose turn it is.  
// 		5.1.1) If it’s the player’s turn and the player clicks the “hit” button and invokes the Hit() function, then invoke renderCard() to deal a single new card to the player.	 	
// 5.1.2) Display the hitStandMsg().
// 5.1.3) If the player clicks the “hit button” and invoke the Hit() function, then invoke renderCard() to deal a single new card to the player. Repeat until the player scores over 21 in the Bust() function or clicks on the “stand” button invoking the Stand() function.	
// 5.1.4) If the playerPoints > 21, then invoke the Bust() function.
// 	5.2) The Hit() function is invoked after the player clicks the “hit” button:
// 		5.2.1) Invoke the playDeal() function which will add up the cards dealt so far by the player in a cardsDealtSoFar variable and make sure that the card total is less than 21. If the cardsDealtSoFar < 21, display the hitStandMsg();
// 5.2.2) Create a hitDeal() function and include a loop to deal another card if the player again hits the “hit” button until the 5 card slots are filled. 
// 5.2.3) If the cardsDealtSoFar variable > 21, the player automatically loses and go to the loseDistribution() function.
// 	
//5.6) Set the winner variable if there's a winner in the winningFormula() function:
// 		5.6.1) If (playerPoints > dealerPoints), the player wins and invoke the winDistribution()functions.
// 		5.6.2) If (playerPoints < dealerPoints), the dealer wins and invoke the loseDistribution() function.
// 		5.6.2) If (playerPoints = dealerPoints), the player and dealer push and invoke the pushDistribution() function.
		
// 	5.7) The winDistribution() function takes the enterBet variable and adds it to and updates the chipTotal variable. And invokes the winMsg().
// 	5.8) 	The loseDistribution() function takes the enterBet variable and subtracts it to and updates the chipTotal variable. And invokes the loseMsg().	
// 		5.8.1) If (chipTotal - enterBet < 0), the player has gone broke and invoke the goneBrokeMsg();
// 	5.9) The pushDistribution() function takes the enterBet variable and neither adds nor subtracts from the chipTotal variable. And invokes the pushMsg().

// 6) Win, lose, gone broke or push messages:
//	6.1) The winMsg() returns “You win! ${enterBet} was added to your chip total. Would you like to play again?”

    function winMsg( ) {
      return `“You win! ${enterBet} was added to your chip total. Would you like to play again?”`;    
    }

// 		6.1.1) Display the “new game” button
// 	6.2) The loseMsg() returns “You lose! ${enterBet} was subtracted to your chip total. Would you like to play again?”

    function loseMsg(){
      return `“You lose! ${enterBet} was subtracted to your chip total. Would you like to play again?”`;
    } 

// 		6.2.1) Display the “new game” button
// 	6.3) The goneBrokeMsg() returns “Oh boy! You’ve gone broke, sucker!! The game is now over.”
// 		6.3.1) Keep the “new game” button frozen and freeze out the enterBet input box with “BUSTED” as the text input.
// 	6.4) The pushMsg() returns “You and the dealer have pushed. Your bet of ${enterBet} will neither be added or subtracted from your chip total. Would you like to play again?”
// 	
    function pushMsg() {
      return `“You and the dealer have pushed. Your bet of ${enterBet} will neither be added or subtracted from your chip total. Would you like to play again?”`;
    }

//6.4.1) Display the “new game” button