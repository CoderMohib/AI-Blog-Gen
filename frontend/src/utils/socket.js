import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = (token) => {
  if (socket) {
    socket.close();
  }

  socket = io('http://localhost:3000', {
    auth: {
      token: token
    },
    autoConnect: true
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

export default socket;
