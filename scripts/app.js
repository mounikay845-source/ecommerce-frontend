console.log("API Loading...");

// ================= GLOBAL VARIABLES =================
let allProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const productGrid = document.getElementById("productGrid");
const cartCounter = document.getElementById("cartCount");
const wishlistCounter = document.getElementById("wishlistCount");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

// ================= UPDATE COUNTERS =================
if (cartCounter) {
    cartCounter.textContent = cart.length;
}
if (wishlistCounter) {
    wishlistCounter.textContent = wishlist.length;
}

// ================= SHOW LOADING PLACEHOLDERS =================
function showPlaceholders() {
    if (!productGrid) return;

    productGrid.innerHTML = "";

    for (let i = 0; i < 8; i++) {
        const placeholder = document.createElement("div");
        placeholder.classList.add("product-card");
        placeholder.innerHTML = `
            <div class="skeleton-img"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text small"></div>
            <div class="skeleton-btn"></div>
        `;
        productGrid.appendChild(placeholder);
    }
}

showPlaceholders();

// ================= FETCH PRODUCTS =================
if (loading) loading.style.display = "block";

fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(data => {
        if (loading) loading.style.display = "none";

        allProducts = data;
        displayProducts(data);
    })
    .catch(error => {
        if (loading) loading.style.display = "none";

        if (errorMessage) {
            errorMessage.textContent = "Failed to load products. Please try again.";
        }
        console.error("API Error:", error);
    });

// ================= DISPLAY PRODUCTS =================
function displayProducts(products) {
    const productGrid = document.getElementById("productGrid");
    productGrid.innerHTML = "";

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
            <div class="action-buttons">
    <button class="cart-btn"
        onclick="addToCart(${product.id})">
        Add to Cart
    </button>

    <button class="wishlist-btn"
        onclick="addToWishlist(${product.id})">
        ❤️
    </button>
</div>
        `;
        function addToCart(product) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.id == product.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        product.quantity = 1;   // ⭐ IMPORTANT
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
}

        // 👇 Redirect to product detail page
        productCard.addEventListener("click", (e) => {
            if (e.target.tagName !== "BUTTON") {
                window.location.href = `product.html?id=${product.id}`;
            }
        });

        productGrid.appendChild(productCard);
    });
}

// ================= FILTER CATEGORY =================
function filterCategory(category) {
    const filtered = allProducts.filter(product =>
        product.category === category
    );

    displayProducts(filtered);
}

// ================= ADD TO CART =================
function addToCart(id) {

    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        product.quantity = 1;  // ⭐ Important
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    if (cartCounter) {
        cartCounter.textContent =
            cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    showPopup("Added to cart ✅");
}
// ================= ADD TO WISHLIST =================
function addToWishlist(id) {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    const existing = wishlist.find(item => item.id === id);

    if (existing) {
        showPopup("Already in wishlist ❤️");
        return;
    }

    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    if (wishlistCounter) {
        wishlistCounter.textContent = wishlist.length;
    }

    showPopup("Added to wishlist ❤️");
}

// ================= POPUP MESSAGE =================
function showPopup(message) {
    const popup = document.getElementById("cartPopup");
    if (!popup) return;

    popup.innerHTML = message;
    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    }, 2000);
}