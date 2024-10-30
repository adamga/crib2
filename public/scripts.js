const socket = io();

const gameState = {
  playerHand: [],
  opponentHand: [],
  deck: [],
  cribbageBoard: {},
  chatMessages: [],
  notifications: [],
  customizationOptions: {
    theme: 'classic',
    avatar: 'avatar1',
  },
};

function updateGameState(newState) {
  Object.assign(gameState, newState);
  renderGame();
}

function renderGame() {
  // Render cribbage board
  const cribbageBoard = document.getElementById('cribbage-board');
  // Add code to render the cribbage board with pegs

  // Render player hand
  const playerHand = document.getElementById('player-hand');
  playerHand.innerHTML = '';
  gameState.playerHand.forEach((card) => {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.innerText = card;
    cardElement.addEventListener('click', () => handleCardClick(card));
    playerHand.appendChild(cardElement);
  });

  // Render opponent hand
  const opponentHand = document.getElementById('opponent-hand');
  opponentHand.innerHTML = '';
  gameState.opponentHand.forEach((card) => {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.innerText = card;
    opponentHand.appendChild(cardElement);
  });

  // Render deck
  const deck = document.getElementById('deck');
  deck.innerHTML = '';
  gameState.deck.forEach((card) => {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.innerText = card;
    deck.appendChild(cardElement);
  });

  // Render chat messages
  const chatMessages = document.getElementById('chat-messages');
  chatMessages.innerHTML = '';
  gameState.chatMessages.forEach((message) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    chatMessages.appendChild(messageElement);
  });

  // Render notifications
  const notifications = document.getElementById('notifications');
  notifications.innerHTML = '';
  gameState.notifications.forEach((notification) => {
    const notificationElement = document.createElement('div');
    notificationElement.innerText = notification;
    notifications.appendChild(notificationElement);
  });

  // Render customization options
  const themeSelect = document.getElementById('theme-select');
  themeSelect.value = gameState.customizationOptions.theme;
  const avatarSelect = document.getElementById('avatar-select');
  avatarSelect.value = gameState.customizationOptions.avatar;
}

function handleCardClick(card) {
  socket.emit('gameAction', { action: 'playCard', card });
}

document.getElementById('chat-send').addEventListener('click', () => {
  const chatInput = document.getElementById('chat-input');
  const message = chatInput.value;
  socket.emit('sendMessage', message);
  chatInput.value = '';
});

document.getElementById('theme-select').addEventListener('change', (event) => {
  const theme = event.target.value;
  gameState.customizationOptions.theme = theme;
  renderGame();
});

document.getElementById('avatar-select').addEventListener('change', (event) => {
  const avatar = event.target.value;
  gameState.customizationOptions.avatar = avatar;
  renderGame();
});

socket.on('updateGameState', (newState) => {
  updateGameState(newState);
});

socket.on('receiveMessage', (message) => {
  gameState.chatMessages.push(message);
  renderGame();
});

socket.on('receiveNotification', (notification) => {
  gameState.notifications.push(notification);
  renderGame();
});
