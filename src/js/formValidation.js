document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signup-form");
  const error = document.getElementById("error-message");
  const success = document.getElementById("success-message");
  const terms = document.getElementById("terms");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Stop the form from submitting

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Simple checks
    if (!username || !email || !password || !confirmPassword) {
      error.textContent = "All fields are required.";
      success.textContent = "";
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      error.textContent = "Enter a valid email address.";
      success.textContent = "";
      return;
    }

    if (password.length < 8) {
      error.textContent = "Password must be at least 8 characters.";
      success.textContent = "";
      return;
    }

    if (password !== confirmPassword) {
      error.textContent = "Passwords do not match.";
      success.textContent = "";
      return;
    }
    
    if (!terms.checked) {
      error.textContent = "Please accept the Terms and Conditions.";
      success.textContent = "";
      return;
    }

    // If everything is correct
    error.textContent = "";
    success.textContent = "Signup successful!";
  });
});
