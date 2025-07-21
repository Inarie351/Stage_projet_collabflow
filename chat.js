const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté', socket.id);

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg); // Diffuse le message à tous les clients
  });

  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté', socket.id);
  });
});

server.listen(2000, () => {
  console.log('Serveur écoutant sur le port 2000');
});
