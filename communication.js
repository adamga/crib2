const socketIo = require('socket.io');
const gameController = require('./gameController');

let io;

function initialize(server) {
  io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinGame', (username) => {
      console.log(`${username} joined the game`);
      // Add logic to handle a player joining the game
    });

    socket.on('sendMessage', (message) => {
      console.log(`Message received: ${message}`);
      io.emit('receiveMessage', message);
    });

    socket.on('gameAction', (data) => {
      const { action, card } = data;
      const result = gameController.handleAction(socket.username, action, { card });
      io.emit('updateGameState', result.gameState);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
      // Add logic to handle a player disconnecting
    });
  });
}

module.exports = {
  initialize,
};
