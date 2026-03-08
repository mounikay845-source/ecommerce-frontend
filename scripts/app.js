// ================= GLOBAL VARIABLES =================
let allProducts = [];
let displayedProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const productGrid = document.getElementById("productGrid");
const cartCounter = document.getElementById("cartCount");
const wishlistCounter = document.getElementById("wishlistCount");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
let user = localStorage.getItem("loggedInUser");

// Elements for new features
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const body = document.body;

// ================= THEME INIT =================
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    body.classList.add("dark-theme");
    body.classList.remove("light-theme");
    if(themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

if(themeToggleBtn){
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

// ================= MOBILE MENU =================
const hamburgerMenu = document.getElementById("hamburgerMenu");
const navLinks = document.getElementById("nav-links");

if (hamburgerMenu && navLinks) {
    hamburgerMenu.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        const icon = hamburgerMenu.querySelector("i");
        if (navLinks.classList.contains("active")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-times");
        } else {
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        }
    });
}

// ================= AUTH UI UPDATE =================
const authActions = document.getElementById("authActions");
if (user) {
    if(authActions) {
        authActions.innerHTML = `
            <button onclick="logout()" class="logout-btn">Logout</button>
        `;
    }
}

function logout() {
    localStorage.removeItem("loggedInUser");
    showToast("Logged out successfully!", "success");
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// ================= UPDATE COUNTERS =================
function updateCounters() {
    if (cartCounter) cartCounter.textContent = cart.length;
    if (wishlistCounter) wishlistCounter.textContent = wishlist.length;
}
updateCounters();

// ================= SHOW SKELETON PLACEHOLDERS =================
function showPlaceholders() {
    if (!productGrid) return;
    productGrid.innerHTML = "";
    for (let i = 0; i < 8; i++) {
        const placeholder = document.createElement("div");
        placeholder.classList.add("skeleton-card");
        placeholder.innerHTML = `
            <div class="skeleton-img"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text short"></div>
            <div class="skeleton-text price"></div>
            <div style="display:flex; gap:10px;">
                <div class="skeleton-btn" style="flex:1;"></div>
                <div class="skeleton-btn" style="width:45px;"></div>
            </div>
        `;
        productGrid.appendChild(placeholder);
    }
}

// ================= FETCH PRODUCTS =================
if(productGrid) {
    showPlaceholders();
    
    fetch("https://fakestoreapi.com/products")
        .then(res => {
            if(!res.ok) throw new Error("Network response was not ok");
            return res.json();
        })
        .then(data => {
            allProducts = data;
            displayedProducts = [...allProducts];
            displayProducts(displayedProducts);
            if(errorMessage) errorMessage.style.display = "none";
        })
        .catch(error => {
            if(productGrid) productGrid.innerHTML = "";
            if (errorMessage) {
                errorMessage.style.display = "block";
                errorMessage.textContent = "Failed to load products. Please try again later.";
            }
            console.error("API Error:", error);
        });
}

// ================= DISPLAY PRODUCTS =================
function displayProducts(products) {
    if (!productGrid) return;
    productGrid.innerHTML = "";
    
    if (products.length === 0) {
        productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 2rem; color: var(--text-muted);">No products found.</p>`;
        return;
    }

    products.forEach(product => {
        // SECURITY: Sanitize output fetched from external API
        const safeTitle = DOMPurify.sanitize(product.title);
        const safePrice = DOMPurify.sanitize(product.price.toString());
        const safeImage = DOMPurify.sanitize(product.image);
        
        const isWishlisted = wishlist.some(item => item.id === product.id);

        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <span class="badge" style="display: ${product.rating.rate > 4.5 ? 'block' : 'none'}">Top Rated</span>
            <div class="img-container">
                <img src="${safeImage}" alt="${safeTitle}" loading="lazy">
            </div>
            <h3>${safeTitle}</h3>
            <p class="price">$${safePrice}</p>
            <div class="action-buttons">
                <button class="cart-btn" onclick="addToCartEvent(event, ${product.id})">
                    <i class="fa-solid fa-cart-plus"></i> Add to Cart
                </button>
                <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="addToWishlistEvent(event, ${product.id})">
                    <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>
            </div>
        `;

        productCard.addEventListener("click", () => {
            window.location.href = `product.html?id=${product.id}`;
        });

        productGrid.appendChild(productCard);
    });
}

// Wrappers to prevent card click propagation
window.addToCartEvent = function(e, id) {
    e.stopPropagation();
    addToCart(id);
};

window.addToWishlistEvent = function(e, id) {
    e.stopPropagation();
    addToWishlist(id);
};

// ================= SEARCH & SORT =================
if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        const term = e.target.value.toLowerCase();
        displayedProducts = allProducts.filter(p => p.title.toLowerCase().includes(term));
        applySort();
    });
}

if (sortSelect) {
    sortSelect.addEventListener("change", () => {
        applySort();
    });
}

function applySort() {
    if(!sortSelect) return;
    const sortVal = sortSelect.value;
    
    // Create a copy to sort
    let sortedList = [...displayedProducts];
    
    if (sortVal === "price-low") {
        sortedList.sort((a, b) => a.price - b.price);
    } else if (sortVal === "price-high") {
        sortedList.sort((a, b) => b.price - a.price);
    }
    // "default" keeps the current filtered order
    
    displayProducts(sortedList);
}

// ================= FILTER CATEGORY =================
window.filterCategory = function(category) {
    if (category === 'allProducts') {
        displayedProducts = [...allProducts];
    } else {
        displayedProducts = allProducts.filter(product => product.category === category);
    }
    // reset search
    if(searchInput) searchInput.value = "";
    applySort();
    
    // smooth scroll to products
    const productsSection = document.getElementById("products");
    if(productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// ================= ADD TO CART =================
function addToCart(id) {
    let loggedUser = localStorage.getItem("loggedInUser");
    if(!loggedUser){
        showToast("Please login first to add items to cart", "error");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
        return;
    }

    const product = allProducts.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);

    if(existing){
        existing.quantity += 1;
        showToast(`Increased quantity of ${DOMPurify.sanitize(product.title).substring(0, 15)}...`, "info");
    } else {
        product.quantity = 1;
        cart.push(product);
        showToast(`Added ${DOMPurify.sanitize(product.title).substring(0, 15)}... to cart ✅`, "success");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCounters();
}

// ================= ADD TO  WISHLIST =================
function addToWishlist(id) {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    const existingIndex = wishlist.findIndex(item => item.id === id);

    if (existingIndex > -1) {
        // Remove from wishlist
        wishlist.splice(existingIndex, 1);
        showToast("Removed from wishlist 💔", "info");
    } else {
        wishlist.push(product);
        showToast("Added to wishlist ❤️", "success");
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateCounters();
    
    // Re-render to update heart icon immediately
    applySort(); 
}

// ================= TOAST NOTIFICATION SYSTEM =================
function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = "fa-info-circle";
    if(type === "success") icon = "fa-check-circle";
    if(type === "error") icon = "fa-exclamation-circle";
    
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    
    container.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.add("hiding");
        toast.addEventListener("animationend", () => {
            if(toast.parentElement) toast.remove();
        });
    }, 3000);
}

// Support older popup function temporarily to avoid breaking other pages
window.showPopup = function(message) {
    showToast(message, "info");
}