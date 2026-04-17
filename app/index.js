import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

const userInputEl = document.getElementById("user-input");
const sendButtonEl = document.getElementById("send-button");
const chatMessagesEl = document.getElementById("chat-messages");
const typingIndicatorEl = document.getElementById("typing-indicator");

// 🔹 Send message when button is clicked
sendButtonEl.addEventListener("click", sendMessage);

// 🔹 Also send message when Enter is pressed
userInputEl.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// 🔹 Main function
async function sendMessage() {
  const userText = userInputEl.value.trim();

  if (!userText) return;

  // 👉 Show user message
  addMessage(userText, "user");

  // 👉 Clear input
  userInputEl.value = "";

  // 👉 Show typing indicator
  typingIndicatorEl.style.display = "flex";

  // 👉 Disable button while loading
  sendButtonEl.disabled = true;
  sendButtonEl.style.opacity = "0.5";

  // 👉 Show loading spinner
  const spinner = document.createElement("div");
  spinner.classList.add("message", "bot-message");
  spinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating response...';
  chatMessagesEl.appendChild(spinner);

  try {
    const response = await fetch("/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: userText })
    });

    const data = await response.json();

    // 👉 Hide typing indicator
    typingIndicatorEl.style.display = "none";

    // 👉 Show bot response
    addMessage(marked.parse(data.message), "bot");

    // 👉 Remove spinner
    chatMessagesEl.removeChild(spinner);
    
  } catch (error) {
    typingIndicatorEl.style.display = "none";
    addMessage("Error: Unable to connect to server", "bot");
    // 👉 Remove spinner
    chatMessagesEl.removeChild(spinner);
    console.error(error);
  }

  // 👉 Enable button again
  sendButtonEl.disabled = false;
  sendButtonEl.style.opacity = "1";
}

// 🔹 Function to add messages to UI
function addMessage(text, sender) {
  const messageDiv = document.createElement("div");

  messageDiv.classList.add("message");

  if (sender === "user") {
    messageDiv.classList.add("user-message");
    messageDiv.innerHTML = `<i class="fas fa-user"></i> ${text}`;
  } else {
    messageDiv.classList.add("bot-message");
    messageDiv.innerHTML = `<i class="fas fa-robot"></i> ${text}`;
  }

  chatMessagesEl.appendChild(messageDiv);

}
