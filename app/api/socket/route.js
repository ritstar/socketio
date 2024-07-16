import { Server } from 'socket.io';

let drawingState = [];

const SocketHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server, {
      path: '/api/socketio',
    });
    res.socket.server.io = io;

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
  }

  res.end();
};

export default SocketHandler;
