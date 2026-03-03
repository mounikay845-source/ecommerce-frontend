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
    if (!productGrid) return;

    productGrid.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <img src="${product.image}" loading="lazy">
            <h3>${product.title.substring(0, 40)}...</h3>
            <p>$${product.price}</p>
            <button class="btn" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
            <button class="wishlist-btn" onclick="addToWishlist(${product.id})">
                ❤️
            </button>
        `;

        productGrid.appendChild(card);
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

    const alreadyInCart = cart.find(item => item.id === id);

    if (alreadyInCart) {
        showPopup("Product already in cart ⚠️");
        return;
    }

    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));

    if (cartCounter) {
        cartCounter.textContent = cart.length;
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