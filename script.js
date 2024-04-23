import Deck from "./deck.js"

const CARD_VALUE_MAP = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14
}

const computerCardSlot = document.querySelector(".computer-card-slot")
const playerCardSlot = document.querySelector(".player-card-slot")
const computerDeckElement = document.querySelector(".computer-deck")
const playerDeckElement = document.querySelector(".player-deck")
const text = document.querySelector(".text")

let playerDeck=[];
let computerDeck=[];
let inRound;
let stop;

document.addEventListener("click", () => {
  if (stop) {
    startGame()
    return
  }

  if (inRound) {
    cleanBeforeRound()
  } else {
    flipCards()
  }
})

startGame()
function startGame() {
  const deck = new Deck()
  deck.shuffle()

  const deckMidpoint = Math.ceil(deck.numberOfCards / 2)
  playerDeck = new Deck(deck.cards.slice(0, deckMidpoint))
  computerDeck = new Deck(deck.cards.slice(deckMidpoint, deck.numberOfCards))
  inRound = false
  stop = false

  cleanBeforeRound()
}

function cleanBeforeRound() {
  inRound = false
  computerCardSlot.innerHTML = ""
  playerCardSlot.innerHTML = ""
  text.innerText = ""

  updateDeckCount()
}

function flipCards() {
  inRound = true

  const playerCard = playerDeck.pop()
  const computerCard = computerDeck.pop()

  playerCardSlot.appendChild(playerCard.getHTML())
  computerCardSlot.appendChild(computerCard.getHTML())

  updateDeckCount()

  if (isRoundWinner(playerCard, computerCard)) {
    text.innerText = "Player Won"
    playerDeck.push(playerCard, computerCard)
  } else if (isRoundWinner(computerCard, playerCard)) {
    text.innerText = "Player Lost"
    computerDeck.push(playerCard, computerCard)
  } else {
    text.innerText = "WAR!!!"
    initiateWar(playerCard, computerCard)
  }

  if (isGameOver(playerDeck)) {
    text.innerText = "You Lose!!"
    stop = true
  } else if (isGameOver(computerDeck)) {
    text.innerText = "You Win!!"
    stop = true
  }
}

function initiateWar(playerCard, computerCard) {
  const playerExtraCards = [];
  const computerExtraCards = [];

  playerCardSlot.innerHTML = "";
  computerCardSlot.innerHTML = "";

  playerCardSlot.classList.add("card-container");
  computerCardSlot.classList.add("card-container");

  // Adiciona mais 4 cartas para cada jogador
  for (let i = 0; i < 4; i++) {
    if (playerDeck.numberOfCards > 0 && computerDeck.numberOfCards > 0) {
      playerExtraCards.push(playerDeck.pop())
      computerExtraCards.push(computerDeck.pop())
    }
  }

  // Mostrar as cartas extras na interface
  playerExtraCards.forEach(card => playerCardSlot.appendChild(card.getHTML()));
  computerExtraCards.forEach(card => computerCardSlot.appendChild(card.getHTML()));

  // Compara as últimas cartas para determinar o vencedor
  const warWinner = determineWarWinner(playerExtraCards, computerExtraCards)

  if (warWinner === "player") {
    text.innerText = "Player Wins WAR!!!"
    playerDeck.push(playerCard, computerCard, ...playerExtraCards, ...computerExtraCards);
  } else if (warWinner === "computer") {
    text.innerText = "Computer Wins WAR!!!"
    computerDeck.push(playerCard, computerCard, ...playerExtraCards, ...computerExtraCards);
  } else {
    // Em caso de empate, ambas as cartas são recolocadas no baralho
    flipCards()
  }
 
   // Atualiza a contagem de cartas nos elementos da interface
   updateDeckCount(); 
}

function determineWarWinner(playerExtraCards, computerExtraCards) {
  // Compara as últimas cartas extras para determinar o vencedor do "War"
  const playerLastCard = playerExtraCards[playerExtraCards.length - 1];
  const computerLastCard = computerExtraCards[computerExtraCards.length - 1];

  if (isRoundWinner(playerLastCard, computerLastCard)) {
    return "player";
  } else if (isRoundWinner(computerLastCard, playerLastCard)) {
    return "computer";
  } else {
    // Em caso de empate, retorna "draw"
    return "WAR!!!";
  }
}

function updateDeckCount() {
  computerDeckElement.innerText = computerDeck.numberOfCards
  playerDeckElement.innerText = playerDeck.numberOfCards
}

function isRoundWinner(cardOne, cardTwo) {
  return CARD_VALUE_MAP[cardOne.value] > CARD_VALUE_MAP[cardTwo.value]
}

function isGameOver(deck) {
  return deck.numberOfCards === 0
}