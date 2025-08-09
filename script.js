document.querySelector(".chatbot-toggle").addEventListener("click", () => {
  const chatWindow = document.querySelector(".chatbot-window");
  chatWindow.style.display = chatWindow.style.display === "none" ? "flex" : "none";
});

function handleUserInput() {
  const input = document.getElementById("user-input").value.trim().toLowerCase();
  if (!input) return;

  appendMessage("user", input);

  let response = "";

  if (/graphic design/.test(input)) {
    response = "🎨 Graphic Design:\nPrice: ₹7,999\nDuration: 3 Months\nIncludes hands-on projects and portfolio building.";
  } else if (/ui\/?ux design/.test(input)) {
    response = "🧩 UI/UX Design:\nPrice: ₹4,999\nDuration: 3 Months\nIncludes wireframing, prototyping, and user research.";
  } else if (/web development/.test(input)) {
    response = "💻 Web Development:\nPrice: ₹12,999 – ₹49,999\nDuration: 6 Months\nCovers HTML, CSS, JS, React, Node.js.";
  } else if (/c programming/.test(input)) {
    response = "🔧 C Programming:\nPrice: ₹2,999 – ₹12,999\nDuration: 3 Months\nIncludes syntax, memory management, and data structures.";
  } else if (/python programming/.test(input)) {
    response = "🐍 Python Programming:\nPrice: ₹2,999 – ₹12,999\nDuration: 3 Months\nCovers syntax, OOP, and real-world projects.";
  } else if (/enroll/.test(input)) {
    response = "🚀 You can enroll now by clicking [Enroll Now](#). Let’s get started!";
  } else if (/contact/.test(input)) {
    response = "📞 You can contact us at +91xxxxxxxx89 or email us at 21brac0401@polygwalior.ac.in for more information.";
  } else if (/hi|hello|hey/.test(input)) {
    response = "👋 Hello, how may i help you ";
  }else if (/bye|exit|quit/.test(input)) {
    response = "👋 Goodby thanks for chatting with us";
  } else if (/thank you|thanks/.test(input)) {
    response = "😊 You're welcome";
  } else if (/help/.test(input)) {
    response = "🆘 How can I assist you? You can ask about our courses, pricing, or enrollment process."
    } else if (/courses|programs/.test(input)) {
      response = "📚 We offer courses in Graphic Design, UI/UX Design, Web Development, C Programming, and Python Programming. You can ask for details on any of these.";
  } else {
    response = "🤔 I'm not sure about that. You can ask about Graphic Design, UI/UX, Web Development, C Programming, or Python Programming.";
  }

  appendMessage("bot", response);
  document.getElementById("user-input").value = "";
}

function appendMessage(sender, text) {
  const chatBody = document.getElementById("chat-body");
  const message = document.createElement("div");
  message.className = sender === "bot" ? "bot-message" : "user-message";
  message.textContent = text;
  chatBody.appendChild(message);
  chatBody.scrollTop = chatBody.scrollHeight;
}