const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const gameController = require('./gameController');
const communication = require('./communication');
const auth = require('./auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const token = auth.generateToken(username);
  res.json({ token });
});

app.use((req, res, next) => {
  const token = req.headers['authorization'];
  if (token) {
    jwt.verify(token, 'your-secret-key', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

app.post('/game/action', (req, res) => {
  const { action, data } = req.body;
  const result = gameController.handleAction(req.user.username, action, data);
  res.json(result);
});

io.on('connection', (socket) => {
  communication.handleConnection(socket);
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
