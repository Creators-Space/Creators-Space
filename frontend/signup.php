<?php
// frontend/signup.php
session_start();

// If already logged in, redirect to home
if (isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}

$error = $_SESSION['error'] ?? '';
if ($error) {
    unset($_SESSION['error']);
}

// Set page-specific variables
$pageTitle = "Sign Up";
$pageDescription = "Create your Creators-Space account";
$bodyClass = "auth-page";

// Include header
include './includes/header.php';
?>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .main-content {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      padding: 1.5rem 1rem;
    }

    .container {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 2.5rem;
      border-radius: 20px;
      width: 100%;
      max-width: 600px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      font-size: 14px;
      color: #64748b;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .back-link:hover {
      color: #334155;
    }

    h2 {
      text-align: center;
      margin-bottom: 0.5rem;
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
    }

    .subtitle {
      text-align: center;
      color: #64748b;
      font-size: 0.95rem;
      margin-bottom: 2rem;
      font-weight: 400;
    }

    .form-columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
      margin-bottom: 1.25rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #374151;
      font-weight: 500;
      font-size: 0.95rem;
    }

    .input-wrapper {
      position: relative;
    }

    input[type="text"],
    input[type="email"],
    input[type="password"] {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.8);
      font-size: 1rem;
      font-weight: 400;
      transition: all 0.2s ease;
      color: #1f2937;
    }

    input[type="password"] {
      padding-right: 3rem;
    }

    input[type="text"]:focus,
    input[type="email"]:focus,
    input[type="password"]:focus {
      outline: none;
      border-color: #667eea;
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    input[type="text"]::placeholder,
    input[type="email"]::placeholder,
    input[type="password"]::placeholder {
      color: #9ca3af;
    }

    .toggle-password {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      color: #6b7280;
      font-size: 1.1rem;
      transition: color 0.2s ease;
    }

    .toggle-password:hover {
      color: #374151;
    }

    .inline-feedback {
      font-size: 0.85rem;
      color: #dc2626;
      margin-top: 0.5rem;
      font-weight: 500;
    }

    .checkbox-group {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      font-size: 0.95rem;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }

    .checkbox-group input[type="checkbox"] {
      width: 1.1rem;
      height: 1.1rem;
      accent-color: #667eea;
      cursor: pointer;
      margin-top: 0.125rem;
      flex-shrink: 0;
    }

    .checkbox-group label {
      color: #374151;
      font-weight: 400;
      cursor: pointer;
      margin-bottom: 0;
    }

    .checkbox-group a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .checkbox-group a:hover {
      color: #5b21b6;
      text-decoration: underline;
    }

    .btn {
      width: 100%;
      padding: 0.875rem;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    .btn:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .spinner {
      display: none;
      width: 28px;
      height: 28px;
      margin: 1rem auto 0;
      border: 3px solid rgba(102, 126, 234, 0.3);
      border-top: 3px solid #667eea;
      border-radius: 50%;
    }

    .error-message {
      background: rgba(254, 226, 226, 0.8);
      color: #dc2626;
      padding: 1rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      border: 1px solid #fecaca;
      font-weight: 500;
      font-size: 0.95rem;
    }

    .success-message {
      background: rgba(220, 252, 231, 0.8);
      color: #166534;
      padding: 1rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      border: 1px solid #bbf7d0;
      font-weight: 500;
      font-size: 0.95rem;
    }

    .login-section {
      text-align: center;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
    }

    .login-section p {
      color: #64748b;
      font-size: 0.95rem;
      margin-bottom: 0;
    }

    .login-section a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s ease;
    }

    .login-section a:hover {
      color: #5b21b6;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 1rem;
      }
      
      .container {
        padding: 2rem 1.5rem;
        border-radius: 16px;
        max-width: 420px;
      }

      .form-columns {
        grid-template-columns: 1fr;
        gap: 0;
      }

      .form-group.full-width {
        grid-column: 1;
      }

      .form-group {
        margin-bottom: 1.25rem;
      }
      
      h2 {
        font-size: 1.75rem;
      }

      .subtitle {
        margin-bottom: 1.5rem;
      }
    }
      .back-btn {
      background: linear-gradient(to right, #667eea, #764ba2); /* same as Sign In */
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      transition: 0.3s ease;
      }

      .back-btn:hover {
      opacity: 0.9; /* subtle hover effect like Sign In */
      }
  </style>
</head>

<body>
  <div class="main-content">
    <div class="container">
      <a href="index.php">
      <button type="button" class="back-btn"> Home </button>
      </a>
      <!--<a href="index.php" class="back-link">
        ← Back to Homepage
      </a>-->
    
      <h2>Join Creators-Space</h2>
      <p class="subtitle">Create your account to start learning</p>

      <?php if ($error): ?>
        <div class="error-message">
          <?php echo htmlspecialchars($error); ?>
        </div>
      <?php endif; ?>

      <div id="message-container"></div>

      <form id="signup-form" method="POST" action="../backend/auth/signup_process.php">
        <div class="form-columns">
          <div class="form-group">
            <label for="first_name">First Name</label>
            <div class="input-wrapper">
              <input type="text" id="first_name" name="first_name" placeholder="Enter first name" required />
            </div>
          </div>
          <div class="form-group">
            <label for="last_name">Last Name</label>
            <div class="input-wrapper">
              <input type="text" id="last_name" name="last_name" placeholder="Enter last name" />
            </div>
          </div>
        </div>

        <div class="form-group full-width">
          <label for="username">Username (Optional)</label>
          <div class="input-wrapper">
            <input type="text" id="username" name="username" placeholder="Choose a unique username" />
          </div>
          <div id="usernameFeedback" class="inline-feedback"></div>
        </div>

        <div class="form-group full-width">
          <label for="email">Email Address</label>
          <div class="input-wrapper">
            <input type="email" id="email" name="email" placeholder="Enter your email" required />
          </div>
          <div id="emailFeedback" class="inline-feedback"></div>
        </div>

        <div class="form-columns">
          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <input type="password" id="password" name="password" placeholder="Create password" required minlength="8" />
              <span class="toggle-password" onclick="togglePassword('password')">👁️</span>
            </div>
            <div id="passwordFeedback" class="inline-feedback"></div>
          </div>

          <div class="form-group">
            <label for="confirm_password">Confirm Password</label>
            <div class="input-wrapper">
              <input type="password" id="confirm_password" name="confirm_password" placeholder="Confirm password" required />
              <span class="toggle-password" onclick="togglePassword('confirm_password')">👁️</span>
            </div>
            <div id="matchFeedback" class="inline-feedback"></div>
          </div>
        </div>
      
        <div class="checkbox-group">
          <input type="checkbox" id="terms" name="terms" required />
          <label for="terms">
            I agree to the <a href="tandc.php" target="_blank">Terms and Conditions</a> and <a href="privacy.php" target="_blank">Privacy Policy</a>
          </label>
        </div>

        <button type="submit" class="btn" id="signupBtn">Create Account</button>
        <div class="spinner" id="spinner"></div>

        <div class="login-section">
          <p>Already have an account? <a href="login.php">Sign in here</a></p>
        </div>
      </form>
  </div>
  </div> <!-- Close main-content -->

  <script>
    function togglePassword(id) {
      const input = document.getElementById(id);
      input.type = input.type === "password" ? "text" : "password";
    }

    function showMessage(message, type = 'error') {
      const container = document.getElementById('message-container');
      const className = type === 'success' ? 'success-message' : 'error-message';
      container.innerHTML = `<div class="${className}">${message}</div>`;
      
      // Auto-hide after 10 seconds for success messages (longer to let user read)
      if (type === 'success') {
        setTimeout(() => {
          container.innerHTML = '';
        }, 10000);
      }
    }

    // Real-time validation
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm_password");
    const email = document.getElementById("email");
    const username = document.getElementById("username");
    const matchFeedback = document.getElementById("matchFeedback");
    const emailFeedback = document.getElementById("emailFeedback");
    const passwordFeedback = document.getElementById("passwordFeedback");
    const usernameFeedback = document.getElementById("usernameFeedback");

    // Password strength validation
    password.addEventListener("input", function() {
      const value = this.value;
      let feedback = "";
      
      if (value.length > 0) {
        if (value.length < 8) {
          feedback = "Password must be at least 8 characters long";
        } else if (!/(?=.*[a-z])/.test(value)) {
          feedback = "Password must contain at least one lowercase letter";
        } else if (!/(?=.*[A-Z])/.test(value)) {
          feedback = "Password must contain at least one uppercase letter";
        } else if (!/(?=.*\d)/.test(value)) {
          feedback = "Password must contain at least one number";
        }
      }
      
      passwordFeedback.textContent = feedback;
    });

    // Confirm password validation
    confirmPassword.addEventListener("input", function() {
      matchFeedback.textContent = this.value !== password.value && this.value !== ""
        ? "Passwords do not match"
        : "";
    });

    // Email validation
    email.addEventListener("input", function() {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      emailFeedback.textContent = this.value && !regex.test(this.value)
        ? "Enter a valid email address"
        : "";
    });

    // Username validation
    username.addEventListener("input", function() {
      const value = this.value;
      if (value.length > 0) {
        if (value.length < 3) {
          usernameFeedback.textContent = "Username must be at least 3 characters long";
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          usernameFeedback.textContent = "Username can only contain letters, numbers, and underscores";
        } else {
          usernameFeedback.textContent = "";
        }
      } else {
        usernameFeedback.textContent = "";
      }
    });

    // Handle form submission
    document.getElementById('signup-form').addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('Form submission started');

      // Client-side validation
      if (password.value.length < 8) {
        showMessage("Password must be at least 8 characters long.", 'error');
        return;
      }

      if (password.value !== confirmPassword.value) {
        showMessage("Passwords do not match.", 'error');
        return;
      }

      if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showMessage("Please enter a valid email address.");
        return;
      }

      const spinner = document.getElementById('spinner');
      const signupBtn = document.getElementById('signupBtn');
      
      spinner.style.display = 'block';
      signupBtn.disabled = true;
      signupBtn.textContent = 'Creating Account...';

      const formData = new FormData(this);
      
      // Debug: Log what we're sending
      console.log('Form data being sent:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Use simple relative path
      const signupUrl = '../backend/auth/signup_process.php';
      console.log('Submitting to:', signupUrl);

      fetch(signupUrl, {
        method: 'POST',
        body: formData
      })
      .then(response => {
        console.log('Response status:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.text(); // Get as text first for debugging
      })
      .then(text => {
        console.log('Raw response:', text);
        
        try {
          const data = JSON.parse(text);
          console.log('Parsed response:', data);
          
          // Reset button state first
          spinner.style.display = 'none';
          
          if (data.success) {
            showMessage(data.message, 'success');
            this.reset(); // Clear the form
            
            // Disable the form and show redirect message
            signupBtn.disabled = true;
            signupBtn.textContent = 'Redirecting to Login...';
            
            // Redirect to login page after 3 seconds
            setTimeout(() => {
              window.location.href = 'login.php';
            }, 3000);
          } else {
            showMessage(data.message, 'error');
            signupBtn.disabled = false;
            signupBtn.textContent = 'Create Account';
          }
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          showMessage('Server returned invalid response. Please try again.', 'error');
          spinner.style.display = 'none';
          signupBtn.disabled = false;
          signupBtn.textContent = 'Create Account';
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
        showMessage('Network error occurred. Please check your connection and try again.', 'error');
        spinner.style.display = 'none';
        signupBtn.disabled = false;
        signupBtn.textContent = 'Create Account';
      });
    });
  </script>

</body>
</html>
