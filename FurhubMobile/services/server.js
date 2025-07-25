const { Server } = require('socket.io');
const http = require('http');

// Start basic HTTP server on port 3000
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*", // allow all for testing; restrict later in production
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('sendMessage', (messageData) => {
    // Broadcast the message to the same room
    io.to(messageData.roomId).emit('receiveMessage', messageData);
    console.log('Message sent:', messageData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Socket.IO server running on port 3000');
});
