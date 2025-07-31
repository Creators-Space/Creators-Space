document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.querySelector("input[type='checkbox']");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    checkbox.checked = true;
  }

  checkbox?.addEventListener("change", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  });
});

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function submitForm() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const response = document.getElementById("responseMsg");

  if (!name || !email || !message) {
    response.style.color = "red";
    response.innerText = "Please fill in all fields.";
    return;
  }

  if (!validateEmail(email)) {
    response.style.color = "red";
    response.innerText = "Please enter a valid email.";
    return;
  }

  response.style.color = "green";
  response.innerText = "We received your message and will reply shortly.";

  // clear inputs 
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("message").value = "";
}

document.getElementById("feedback-form").addEventListener("submit", function (e) {
  e.preventDefault(); // prevent page reload
  submitForm();       // run your validation logic
});


