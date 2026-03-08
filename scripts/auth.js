// ================= AUTHENTICATION LOGIC =================

// Helper to display UI Error instead of alerts
function showAuthMessage(msg, type = 'error') {
    const errorDiv = document.getElementById('globalAuthError');
    const successDiv = document.getElementById('globalAuthSuccess');
    
    if (type === 'error' && errorDiv) {
        if(successDiv) successDiv.style.display = 'none';
        errorDiv.textContent = msg;
        errorDiv.style.display = 'block';
    } else if (type === 'success' && successDiv) {
        if(errorDiv) errorDiv.style.display = 'none';
        successDiv.textContent = msg;
        successDiv.style.display = 'block';
    } else {
        alert(msg); // Fallback
    }
}

// Client-Side Validation Regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/; // min 8 chars, 1 uppercase, 1 number

function signupUser(event) {
    if (event) event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;

    if (!name || !email || !password) {
        showAuthMessage("Please fill all fields");
        return;
    }

    if (!emailRegex.test(email)) {
        showAuthMessage("Invalid email format");
        return;
    }

    if (!passwordRegex.test(password)) {
        showAuthMessage("Password must be at least 8 characters long, contain 1 uppercase letter and 1 number.");
        return;
    }

    // Get existing users
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email already exists
    let existingUser = users.find(user => user.email === email);
    if(existingUser){
        showAuthMessage("Email already registered. Try logging in.");
        return;
    }

    // Escape name basically (prevent stored XSS)
    const safeName = name.replace(/[<>'"]/g, "");

    // Create new user (Simulated Backend Storage)
    let newUser = {
        name: safeName,
        email: email,
        password: password // In real world this MUST be hashed!
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    showAuthMessage("Signup successful! Redirecting...", "success");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
}

function loginUser(event){
    if (event) event.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;

    if (!email || !password) {
        showAuthMessage("Please enter email and password");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let validUser = users.find(user => user.email === email && user.password === password);

    if (validUser) {
        localStorage.setItem("loggedInUser", email);
        
        // Use an inline style to simulate button loading state for aesthetics
        const btn = document.querySelector('.auth-btn');
        if(btn) {
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Authenticating...';
            btn.style.opacity = '0.8';
        }

        setTimeout(() => {
            window.location.href = "index.html";
        }, 800);
    } else {
        showAuthMessage("Invalid email or password");
    }
}