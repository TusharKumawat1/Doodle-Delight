import io from "socket.io-client"
const URL = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_SERVER_URL!
  : 'http://localhost:8080';
export const socket = io(URL, {
    path:"/socket",
    transports: ["websocket","polling"],
    reconnection:true,
    reconnectionAttempts:5
});
