import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);
  let AllUser=[]// todo
  io.on("connection", (socket) => {
    console.log("new user joined");
    socket.on("joinRoom",PayLoad=>{
      console.log("roomId : ",PayLoad.roomId)
      socket.join(PayLoad.roomId)
      const UserExists=AllUser.findIndex(user=>user.userId===PayLoad.userId)
      if (UserExists===-1) {
        AllUser.push(PayLoad)
      }else{
        AllUser[UserExists]=PayLoad
      }
      io.in(PayLoad.roomId).emit("users",AllUser.filter(data=>data.roomId===PayLoad.roomId))
      socket.on("removeUser",(userId)=>{
        console.log("userId to be removed : ",userId)
        const UserExists=AllUser.findIndex(user=>user.userId===userId)
        if (UserExists===-1) {
          console.log("No user found")
        }else{
          AllUser.splice(UserExists,1)
        }
        io.in(PayLoad.roomId).emit("userExit",AllUser.filter(data=>data.roomId===PayLoad.roomId))
      })
    })
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
