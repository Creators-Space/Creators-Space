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

/* =========================
   THEME (light/dark)
========================= */
const THEME_KEY = "cs_theme";
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const lbl = document.getElementById("themeLabel");
  if (lbl) lbl.textContent = theme === "dark" ? "☀️" : "🌙";
}
function loadTheme() {
  const t = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(t);
}
document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") || "light";
      const next = cur === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }
});

/* =========================
   WISHLIST (localStorage)
========================= */
const WL_KEY = "cs_wishlist";
function wl_load() {
  try { return JSON.parse(localStorage.getItem(WL_KEY)) || []; }
  catch { return []; }
}
function wl_save(list) { localStorage.setItem(WL_KEY, JSON.stringify(list)); }
function wl_in(id) { return wl_load().some(c => c.id === id); }
function wl_add(course) {
  const wl = wl_load();
  if (!wl.some(c => c.id === course.id)) wl.push(course);
  wl_save(wl);
}
function wl_remove(id) {
  wl_save(wl_load().filter(c => c.id !== id));
}
function wl_toggle(btn) {
  const id = btn.dataset.courseId;
  if (wl_in(id)) {
    wl_remove(id);
    markBtn(btn, false);
  } else {
    wl_add({
      id,
      name: btn.dataset.courseName || "Course",
      img: btn.dataset.courseImg || "",
      url: btn.dataset.courseUrl || "#",
      progress: 0
    });
    markBtn(btn, true);
  }
}
function markBtn(btn, active) {
  btn.classList.toggle("active", active);
  btn.setAttribute("aria-pressed", active ? "true" : "false");
  const i = btn.querySelector("i");
  if (!i) return;
  i.classList.toggle("fa-solid", active);
  i.classList.toggle("fa-regular", !active);
}
function wl_syncButtons() {
  document.querySelectorAll(".wish-btn").forEach(btn => {
    markBtn(btn, wl_in(btn.dataset.courseId));
  });
}
document.addEventListener("click", e => {
  const btn = e.target.closest(".wish-btn");
  if (!btn) return;
  wl_toggle(btn);
});
document.addEventListener("DOMContentLoaded", wl_syncButtons);

/* =========================
   PROGRESS (stored in wl)
========================= */
function prog_set(id, value) {
  const wl = wl_load();
  const item = wl.find(c => c.id === id);
  if (item) {
    item.progress = Math.max(0, Math.min(100, value));
    wl_save(wl);
  }
}
function prog_inc(id, delta = 5) {
  const wl = wl_load();
  const item = wl.find(c => c.id === id);
  if (item) {
    item.progress = Math.max(0, Math.min(100, (item.progress || 0) + delta));
    wl_save(wl);
  }
}
function prog_get(id) {
  const wl = wl_load();
  return (wl.find(c => c.id === id)?.progress) || 0;
}
