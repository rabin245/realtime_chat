const mongoose = require("mongoose");

const Chat = mongoose.model(
  "Chat",
  new mongoose.Schema({
    user: String,
    message: String,
    date: {
      type: Date,
      default: Date.now,
    },
  })
);

async function getAllChatMessages() {
  const chats = await Chat.find();
  return chats;
}

async function addChatMessage({ user, message }) {
  const chat = new Chat({
    user,
    message,
  });
  await chat.save();
  return convertDate(chat.date);
}

function convertDate(date) {
  const d = new Date(date).toLocaleString("en-us", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return d;
}

module.exports = { Chat, getAllChatMessages, addChatMessage, convertDate };
