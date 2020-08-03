// Chat Server running on Port 3000

const server = require('http').createServer();
const io = require('socket.io')(server);

const users = {};
// listens every socket connection
io.on('connection', (socket) => {
  // listens a specific event
  socket.on('new-user-joined', (name) => {
    // socket.id generates unique id for every socket connection
    users[socket.id] = name;
    // broadcasts the message and event to all the socket except the sender
    socket.broadcast.emit('user-joined', name);
  });
  socket.on('send', (message) => {
    socket.broadcast.emit('receive', {
      message: message,
      name: users[socket.id],
    });
  });
  // Socket listens on user disconnection
  socket.on('disconnect', (message) => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log('Server is running...'));
