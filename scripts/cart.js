// ================= GLOBAL VARIABLES =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Apply Theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme");
}

function updateHeaderCounters() {
    const cartC = document.getElementById("cartCount");
    const wishC = document.getElementById("wishlistCount");
    if(cartC) cartC.textContent = cart.length;
    if(wishC) wishC.textContent = wishlist.length;
}

// ================= CART LOGIC =================
function renderCart() {
    const cartContainer = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    
    if(!cartContainer) return;
    cartContainer.innerHTML = "";
    updateHeaderCounters();

    if (cart.length === 0) {
        cartContainer.innerHTML = `<div style="text-align:center; padding: 3rem; color: var(--text-muted);"><i class="fa-solid fa-cart-shopping" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i><br>Your cart is empty.</div>`;
        if(totalEl) totalEl.textContent = "0.00";
        return;
    }

    let total = 0;

    cart.forEach((product, index) => {
        const itemTotal = product.price * (product.quantity || 1);
        total += itemTotal;

        const safeTitle = DOMPurify.sanitize(product.title);
        const safeImage = DOMPurify.sanitize(product.image);

        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";
        itemDiv.innerHTML = `
            <div class="cart-item-img">
                <img src="${safeImage}" alt="${safeTitle}">
            </div>
            <div class="cart-item-info">
                <h4>${safeTitle}</h4>
                <p class="price">$${DOMPurify.sanitize(product.price.toString())}</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${product.quantity || 1}</span>
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeItem(${index})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        cartContainer.appendChild(itemDiv);
    });

    if(totalEl) totalEl.textContent = total.toFixed(2);
}

function updateQuantity(index, change) {
    if(cart[index].quantity === undefined) cart[index].quantity = 1;
    cart[index].quantity += change;
    
    if(cart[index].quantity <= 0) {
        removeItem(index);
    } else {
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function checkout() {
    if(cart.length === 0) {
        alert("Cart is empty!");
        return;
    }
    let loggedUser = localStorage.getItem("loggedInUser");
    if(!loggedUser){
        alert("Please login first to checkout");
        window.location.href = "login.html";
        return;
    }
    
    // Simulate checkout
    alert("Checkout successful! Thank you for your purchase.");
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// ================= WISHLIST LOGIC =================
function renderWishlist() {
    const listContainer = document.getElementById("wishlist-items");
    
    if(!listContainer) return;
    listContainer.innerHTML = "";
    updateHeaderCounters();

    if (wishlist.length === 0) {
        listContainer.innerHTML = `<div style="text-align:center; padding: 3rem; color: var(--text-muted);"><i class="fa-regular fa-heart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i><br>Your wishlist is empty.</div>`;
        return;
    }

    wishlist.forEach((product, index) => {
        const safeTitle = DOMPurify.sanitize(product.title);
        const safeImage = DOMPurify.sanitize(product.image);

        const itemDiv = document.createElement("div");
        itemDiv.className = "product-card"; // Reusing product grid style
        itemDiv.innerHTML = `
            <div class="img-container">
                <img src="${safeImage}" alt="${safeTitle}" loading="lazy">
            </div>
            <h3>${safeTitle}</h3>
            <p class="price">$${DOMPurify.sanitize(product.price.toString())}</p>
            <div class="action-buttons" style="flex-direction: column;">
                <button class="cart-btn" onclick="moveToCart(${index})">
                    <i class="fa-solid fa-cart-plus"></i> Move to Cart
                </button>
                <button class="auth-btn" style="background: var(--danger-color); color: white; margin-top: 5px;" onclick="removeWishlistItem(${index})">
                    <i class="fa-solid fa-trash"></i> Remove
                </button>
            </div>
        `;
        listContainer.appendChild(itemDiv);
    });
}

function removeWishlistItem(index) {
    wishlist.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    renderWishlist();
}

function moveToCart(index) {
    const product = wishlist[index];
    
    // Check if already in cart
    const existingIndex = cart.findIndex(c => c.id === product.id);
    if(existingIndex > -1){
        cart[existingIndex].quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Remove from wishlist
    removeWishlistItem(index);
    alert("Item moved to cart");
}

// Init
document.addEventListener("DOMContentLoaded", () => {
    updateHeaderCounters();
    renderCart();
    renderWishlist();
});
