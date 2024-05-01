import io from "socket.io-client"
const URL = process.env.NODE_ENV === 'production'
  ? 'wss://doodle-delight.vercel.app'
  : 'ws://localhost:3000';
export const socket = io( {
    path:"/socket",
    transports: ["websocket","polling"],
    reconnection:true,
    reconnectionAttempts:5
});
