document.addEventListener("DOMContentLoaded", () => {
    // ================= INITIALIZE THEME =================
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const body = document.body;
    
    // Apply theme from local storage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        body.classList.add("dark-theme");
        body.classList.remove("light-theme");
    }

    // Check layout to map icon
    if (body.classList.contains("dark-theme") && themeToggleBtn) {
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
             if (body.classList.contains("dark-theme")) {
                 body.classList.remove("dark-theme");
                 body.classList.add("light-theme");
                 localStorage.setItem("theme", "light");
                 themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
             } else {
                 body.classList.add("dark-theme");
                 body.classList.remove("light-theme");
                 localStorage.setItem("theme", "dark");
                 themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
             }
        });
    }

    // ================= RESPONSIVE HAMBURGER =================
    const hamburgerMenu = document.getElementById("hamburgerMenu");
    const navLinks = document.getElementById("nav-links");

    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            const icon = hamburgerMenu.querySelector("i");
            if (navLinks.classList.contains("active")) {
                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");
            } else {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        });
    }

    // ================= LOGOUT BUTTON INITIATER =================
    const authActions = document.getElementById("authActions");
    let user = localStorage.getItem("loggedInUser");
    if (user && authActions) {
        authActions.innerHTML = `
            <button onclick="logout()" class="logout-btn"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
        `;
    }

    // ================= ACTIVE LINKS =================
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link").forEach(link => {
        if(link.getAttribute("href") === currentPath || link.getAttribute("href") === `${currentPath}#products`) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
});

window.logout = function() {
    localStorage.removeItem("loggedInUser");
    if(typeof showToast === 'function') {
        showToast("Logged out successfully!", "success");
    } else {
        alert("Logged out successfully!");
    }
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);
};
