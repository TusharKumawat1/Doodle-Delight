import io from "socket.io-client"
export const socket = io("https://doodle-delight.vercel.app", {
    transports: ["websocket"],
});
