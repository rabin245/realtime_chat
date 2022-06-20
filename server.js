const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const mongoose = require("mongoose");

const {
  Chat,
  getAllChatMessages,
  addChatMessage,
  convertDate,
} = require("./utils/chat");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// connect to db
mongoose
  .connect("mongodb://localhost:27047/realtime_chat", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to database..."))
  .catch((err) =>
    console.log("Encountered error while connecting to database: ", err)
  );

app.use(express.static("public"));

// converting date
io.on("connection", (socket) => {
  // get current username
  socket.on("setUsername", (username) => {
    // welcome user
    socket.emit("message", {
      user: "server",
      message: "Welcome to the chat " + username,
    });

    // get all messages
    socket.on("getAllMessages", async () => {
      const allMessages = await getAllChatMessages();

      allMessages.forEach((msg) => {
        socket.emit("message", {
          user: msg.user,
          message: msg.message,
          date: convertDate(msg.date),
        });
      });
    });

    // broadcast when user connects
    socket.broadcast.emit("message", {
      user: "server",
      message: `${username} has joined the chat`,
    });

    // listen for chat message
    socket.on("chatMessage", async (messageObj) => {
      // save to db
      const date = await addChatMessage(messageObj);

      io.emit("message", {
        user: messageObj.user,
        message: messageObj.message,
        date: date,
      });
    });

    // when client disconnects
    socket.on("disconnect", () => {
      io.emit("message", {
        user: "server",
        message: `${username} has left the chat`,
      });
    });
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
