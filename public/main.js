const socket = io();
let username = "";
const chatMsgSend = document.querySelector(".chat-send-btn");
const chatMsgBody = document.querySelector(".chat-messages");

chatMsgSend.addEventListener("click", (e) => {
  e.preventDefault();
  const chatMsg = document.querySelector("#chat-msg");
  const chatMsgValue = chatMsg.value;
  if (chatMsgValue === "") {
    // console.log("empty msg");
    return;
  }

  // Emit message to server
  socket.emit("chatMessage", { user: username, message: chatMsgValue });

  // clear and focus on input
  chatMsg.value = "";
  chatMsg.focus();
});

// popup modal when user connects
$("document").ready(function () {
  setTimeout(() => {
    $(".modal").modal("show");
  }, 500);
});

// save username
$("#save-username").click(function () {
  username = $("#username").val();

  if (username === "") {
    alert("Please enter a username");
    return;
  }
  $(".modal").modal("hide");

  socket.emit("setUsername", username);
  socket.emit("getAllMessages");
});

// message from server
socket.on("message", (msgObj) => {
  // message to all clients
  displayMessage(msgObj);

  // scroll down
  chatMsgBody.scrollTop = chatMsgBody.scrollHeight;
});

// display message to DOM
function displayMessage(msgObj) {
  if (msgObj.user === "server") {
    // server msg
    chatMsgBody.innerHTML += `<hr data-content="${msgObj.message}" class="hr-text">`;
  } else if (msgObj.user === "welcome") {
    // welcome toast
    document.querySelector(".toast-body").innerHTML = msgObj.message;
    $(".toast").toast("show");
  } else {
    // users msg
    if (msgObj.user === username) {
      // own msg
      chatMsgBody.innerHTML += `
      <div class="message-bubble d-flex flex-column align-items-end">
        <p class="p-2 me-3 mb-0 rounded-pill" style="background-color: #0088ff; color: white;">
        ${msgObj.message}
        </p>
        <div class="small me-3 mb-2 text-muted d-flex justify-content-end">
        ${msgObj.date} | You
        </div>
      </div>
      `;
    } else {
      // other users msg
      chatMsgBody.innerHTML += `
      <div class="message-bubble d-flex flex-column align-items-start">
        <p class="p-2 ms-3 mb-0 rounded-pill" style="background-color: #f5f6f7;">
        ${msgObj.message}
        </p>
        <div class="small ms-3 mb-2 text-muted d-flex justify-content-start">
            ${msgObj.user} | ${msgObj.date}
        </div>
      </div>
      `;
    }
  }
}
