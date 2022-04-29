// Shuffle function from http://stackoverflow.com/a/2450976
let shuffle = function(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Determine which values should be tracked in the game
const gameState = {
  nextCard: [],
  gameCards: [],
  userScore: 0,
  matchedCards: 0,
}
const gameContainer = document.querySelector('#cards');
const currentCard = function(e) { 
  if (e.target.classList.contains('card')) {
    matchCards(e);
  }
}

// Get all the current icons, shuffle them and add it to the cards
function shuffleCards() {
  const cardArray = Array.from(document.getElementsByClassName('card'));
  const currentCards = [];
  cardArray.forEach(icon => {
    currentCards.push(icon.innerHTML);
  });
  shuffle(currentCards);
  for (let i = 0; i < cardArray.length; i++) {
    cardArray[i].innerHTML = currentCards[i];
  }
}

// Get the className(icon) of the cards for checking match
function populateCards() {
  document.querySelectorAll('.card .fas').forEach(function(icon) {
    gameState.gameCards.push(icon.className);
  })
  gameState.nextCard = gameState.gameCards;
}

// From the className(icon) display the next card consecutively
function displayNextCard() {
  if (gameState.matchedCards === 12) {
    gameState.matchedCards = 0;
  } else {
    document.getElementById('next-card').querySelector('.fas').className =
    gameState.gameCards[gameState.matchedCards];
  }
}

/**  
* Game Rules
* User clicks a card to reveal the icon
* User should not be able to click another card when one is already showing
* If icon matched the next card icon (MATCHED) change the next card for pairing and add a score
* Else flip down again and add a score
* If all cards are matched stop the game and alert (`Winner! ${score})
*/
function matchCards(e) {
  if (!e.target.classList.contains('matched')) {
    e.target.classList.add('show');
    if (e.target.classList.contains('show')) {
      gameContainer.removeEventListener('click', currentCard);
      if (gameState.nextCard[gameState.matchedCards] === e.target.querySelector('.fas').className) {
        gameState.userScore++;
        gameState.matchedCards++;
        checkWin();
        displayNextCard();
        document.querySelector('#score').textContent = gameState.userScore;
        setTimeout(function() {
          e.target.classList.add('matched');
        }, 300);
      } else {
          gameState.userScore++;
          setTimeout(function() {
            e.target.classList.remove('show');
          }, 600);
        }
      document.querySelector('#score').textContent = gameState.userScore;
      setTimeout(function() {
        gameContainer.addEventListener('click', currentCard);
      }, 600); 
    }
  }
}

/** 
* Resets all the variables of the game,
* shuffle the card,
* hide the cards and reset score 
*/
function resetGame() {
  const coverCard = Array.from(document.getElementsByClassName('card'))
  coverCard.forEach(card => {
    card.classList.remove('show','matched');
  });
  gameState.userScore = 0;
  document.querySelector('#score').textContent = 0;
  shuffleCards();
  gameState.matchedCards = 0;
  displayNextCard();
}

// Check win function that check if all cards are matched and alert the user
function checkWin() {
  if (gameState.matchedCards === 12) {
    setTimeout(() => {
      alert(`Winner! Your Score is ${gameState.userScore}`);
    }, 500);
  }
}

document.querySelector('.restart').addEventListener('click', resetGame);
gameContainer.addEventListener('click', currentCard);
window.onload = function() {
  shuffleCards();
  populateCards();
  resetGame();
};