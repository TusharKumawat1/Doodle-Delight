import io from "socket.io-client"
const URl= process.env.NODE_ENV===`production`?`https://doodle-delight.vercel.app`: `http://localhost:3000`
export const socket = io(URl, {
    path:"/socket",
    transports: ["websocket"],
    reconnection:true,
    reconnectionAttempts:5
});
