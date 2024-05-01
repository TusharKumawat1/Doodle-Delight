import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

try {
  app.prepare().then(() => {
    const httpServer = createServer(handler);
    const io = new Server(httpServer, {
      path: "/socket",
      wssEngine: ["ws", "wss"],
      cors: {
        origin: "*",
      },
      transports: ["websocket", "polling"],
      allowEIO3: true,
    });
    let AllUser = []; // todo
    io.on("connection", (socket) => {
      console.log("new user joined");
      socket.on("joinRoom", (PayLoad) => {
        socket.join(PayLoad.roomId);
        const UserExists = AllUser.findIndex(
          (user) => user.userId === PayLoad.userId
        );
        if (UserExists === -1) {
          AllUser.push(PayLoad);
        } else {
          AllUser[UserExists] = PayLoad;
        }
        io.to(PayLoad.roomId).emit(
          "users",
          AllUser.filter((data) => data.roomId === PayLoad.roomId)
        );
        socket.emit(
          "users",
          AllUser.filter((data) => data.roomId === PayLoad.roomId)
        );
        socket.on("removeUser", (userId) => {
          const UserExists = AllUser.findIndex(
            (user) => user.userId === userId
          );
          if (UserExists === -1) {
            console.log("No user found");
          } else {
            AllUser.splice(UserExists, 1);
          }
          io.in(PayLoad.roomId).emit(
            "userExit",
            AllUser.filter((data) => data.roomId === PayLoad.roomId)
          );
        });
        socket.on("sendMessage", (data) => {
          io.in(PayLoad.roomId).emit("receiveMessage", data);
        });
        socket.on("draw", (data) => {
          io.to(PayLoad.roomId).emit("loadData", data);
        });
      });
    });

    httpServer
      .once("error", (err) => {
        console.log(err);
        process.exit(1);
      })
      .listen(port, () => {
        console.log(`Server ready on http://${hostname}:${port}`);
      });
  });
} catch (error) {
  console.log(error);
}
