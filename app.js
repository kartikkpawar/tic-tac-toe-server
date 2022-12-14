const app = require("express")();
const server = require("http").createServer(app);
require("dotenv").config();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  //Connecting to the room
  socket.on("connect-room", (payload) => {
    socket.join(payload.roomId);
    socket
      .to(payload.roomId)
      .emit("connection-success", { name: payload.name });
  });

  // Sending the XOXO Game board
  socket.on("xo-board", (payload) => {
    socket.to(payload.roomId).emit("game-data", { board: payload.xoBoard });
  });

  // Winning - loose - Draw Message
  socket.on("game-progress", (payload) => {
    socket
      .to(payload.roomId)
      .emit("game-progress", { message: payload.message });
  });

  // Reloading the game
  socket.on("game-reload", (payload) => {
    socket.to(payload.roomId).emit("game-reload", { board: payload.xoBoard });
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server running at ${process.env.PORT}...`);
});
