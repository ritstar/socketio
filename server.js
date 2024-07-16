const express = require('express');
const http = require('http');
const next = require('next');
const { Server } = require('socket.io');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

let drawingState = [];

app.prepare().then(() => {
  const expressApp = express();
  const server = http.createServer(expressApp);
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('getDrawingState', () => {
      console.log('Sending drawing state to new client');
      socket.emit('drawingState', drawingState);
    });

    socket.on('draw', (data) => {
      console.log('Drawing event received');
      drawingState.push(data);
      socket.broadcast.emit('draw', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  expressApp.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});