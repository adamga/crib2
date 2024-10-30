const gameState = {
  players: {},
  deck: [],
  crib: [],
  currentTurn: null,
  scores: {
    player1: 0,
    player2: 0,
  },
};

function initializeGame(player1, player2) {
  gameState.players[player1] = { hand: [], crib: false };
  gameState.players[player2] = { hand: [], crib: false };
  gameState.deck = createDeck();
  gameState.crib = [];
  gameState.currentTurn = player1;
  gameState.scores = {
    player1: 0,
    player2: 0,
  };
  dealCards();
}

function createDeck() {
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const values = [
    'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
  ];
  const deck = [];
  suits.forEach((suit) => {
    values.forEach((value) => {
      deck.push({ suit, value });
    });
  });
  return shuffle(deck);
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function dealCards() {
  Object.keys(gameState.players).forEach((player) => {
    gameState.players[player].hand = gameState.deck.splice(0, 6);
  });
}

function handleAction(player, action, data) {
  switch (action) {
    case 'playCard':
      return playCard(player, data.card);
    case 'discardToCrib':
      return discardToCrib(player, data.card);
    default:
      return { error: 'Invalid action' };
  }
}

function playCard(player, card) {
  if (gameState.currentTurn !== player) {
    return { error: 'Not your turn' };
  }
  const playerHand = gameState.players[player].hand;
  const cardIndex = playerHand.findIndex(
    (c) => c.suit === card.suit && c.value === card.value
  );
  if (cardIndex === -1) {
    return { error: 'Card not found in hand' };
  }
  playerHand.splice(cardIndex, 1);
  gameState.currentTurn = getNextPlayer(player);
  return { success: true, gameState };
}

function discardToCrib(player, card) {
  const playerHand = gameState.players[player].hand;
  const cardIndex = playerHand.findIndex(
    (c) => c.suit === card.suit && c.value === card.value
  );
  if (cardIndex === -1) {
    return { error: 'Card not found in hand' };
  }
  playerHand.splice(cardIndex, 1);
  gameState.crib.push(card);
  return { success: true, gameState };
}

function getNextPlayer(currentPlayer) {
  const players = Object.keys(gameState.players);
  const currentIndex = players.indexOf(currentPlayer);
  return players[(currentIndex + 1) % players.length];
}

module.exports = {
  initializeGame,
  handleAction,
};
