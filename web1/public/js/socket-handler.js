// socket-handler.js
import { Server } from 'socket.io';

export function setupSocketIO(server) {
  const io = new Server(server);
  const rooms = {
    web1: {},
    web2: {}
  };

  io.on('connection', (socket) => {
    let currentRoom = null;

    socket.on('join-user', (data) => {
      const { username, room } = data;
      currentRoom = room; // 'web1' or 'web2'
      
      // Store user in appropriate room
      rooms[currentRoom][username] = { username, id: socket.id };
      socket.join(currentRoom);
      
      // Emit only to users in the same room
      io.to(currentRoom).emit('joined', rooms[currentRoom]);
    });

    socket.on('offer', ({ from, to, offer }) => {
      if (rooms[currentRoom][to]) {
        io.to(rooms[currentRoom][to].id).emit('offer', { from, to, offer });
      }
    });

    socket.on('answer', ({ from, to, answer }) => {
      if (rooms[currentRoom][from]) {
        io.to(rooms[currentRoom][from].id).emit('answer', { from, to, answer });
      }
    });

    socket.on('icecandidate', ({ candidate, to }) => {
      if (rooms[currentRoom][to]) {
        io.to(rooms[currentRoom][to].id).emit('icecandidate', candidate);
      }
    });

    socket.on('chat-message', ({ from, to, message }) => {
      if (rooms[currentRoom][to]) {
        io.to(rooms[currentRoom][to].id).emit('chat-message', { from, message });
      }
    });

    socket.on("file-message", ({ from, to, file, fileName, fileType, room }) => {
      if (rooms[room][to]) {
          io.to(rooms[room][to].id).emit("file-message", { 
              from, 
              fileName, 
              file, 
              fileType 
          });
      }
    });

    socket.on('disconnect', () => {
      if (!currentRoom) return;
      
      // Remove user from appropriate room
      for (let username in rooms[currentRoom]) {
        if (rooms[currentRoom][username].id === socket.id) {
          delete rooms[currentRoom][username];
          break;
        }
      }
      io.to(currentRoom).emit('user-disconnected', rooms[currentRoom]);
    });
  });

  return io;
}