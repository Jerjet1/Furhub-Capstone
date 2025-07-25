import { io } from 'socket.io-client';
import { API_URL } from './api';
// Laptop IP address (same as Django server)
const socket = io('ws://192.168.1.18:8000/ws/chat/room_1/', {
  transports: ['websocket'],
  autoConnect: false,
});

export default socket;
