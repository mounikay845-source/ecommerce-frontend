// 1️⃣ Get product ID from URL
console.log("Product JS Connected");
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// 2️⃣ Select container
const productContainer = document.getElementById("productContainer");

const loading = document.getElementById("loading");
const title = document.getElementById("product-title");
const price = document.getElementById("product-price");
const cartBtn = document.getElementById("detail-cart-btn");

cartBtn.dataset.id = product.id;
cartBtn.dataset.title = product.title;
cartBtn.dataset.price = product.price;
cartBtn.dataset.image = product.image;

title.innerText = "Product Name";
price.innerText = "₹999";console.log("Product JS Connected");

// 1️⃣ Get ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// 2️⃣ Select Elements
const loading = document.getElementById("loading");
const image = document.getElementById("detail-image");
const title = document.getElementById("detail-title");
const description = document.getElementById("detail-description");
const price = document.getElementById("detail-price");
const cartBtn = document.getElementById("detail-cart-btn");
const wishlistBtn = document.getElementById("detail-wishlist-btn");

// 3️⃣ Fetch Product
fetch(`https://fakestoreapi.com/products/${productId}`)
    .then(response => response.json())
    .then(product => {

        if (loading) loading.style.display = "none";

        if (image) image.src = product.image;
        if (title) title.innerText = product.title;
        if (description) description.innerText = product.description;
        if (price) price.innerText = "$" + product.price;

        if (cartBtn) {
            cartBtn.addEventListener("click", function () {
                alert("Product added to cart!");
            });
        }

        if (wishlistBtn) {
            wishlistBtn.addEventListener("click", function () {
                alert("Product added to wishlist!");
            });
        }
    })
    .catch(error => {
        if (loading) loading.innerText = "Error loading product.";
        console.error(error);
    });
// 3️⃣ Fetch product using ID
fetch(`https://fakestoreapi.com/products/${productId}`)
    .then(response => response.json())
    .then(product => {

        loading.style.display = "none";

        productContainer.innerHTML = `
            <div class="product-detail-card">
                <img src="${product.image}" alt="${product.title}" width="300">
                <h2>${product.title}</h2>
                <p>${product.description}</p>
                <h3>$${product.price}</h3>
                
                <button onclick="addToCart(${product.id})">
                    Add to Cart
                </button>

                <button onclick="addToWishlist(${product.id})">
                    ❤️
                </button>
            </div>
        `;
    })
    .catch(error => {
        loading.innerText = "Error loading product.";
    });


// 4️⃣ Cart Function
function addToCart(id) {
    alert("Product added to cart!");
}

// 5️⃣ Wishlist Function
function addToWishlist(id) {
    alert("Product added to wishlist!");
}
/* ================= PRODUCT PAGE CART ================= */

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartCount = document.getElementById("cartCount");
    if (cartCount) {
        cartCount.innerText = total;
    }
}

function showPopup(message) {
    const popup = document.getElementById("cartPopup");
    if (!popup) return;

    popup.innerText = message;
    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    }, 2000);
}

function addToCart(product) {

    let cart = getCart();

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    saveCart(cart);
    updateCartCount();
    showPopup("Item added to cart!");
}

document.addEventListener("click", function (e) {

    if (e.target.classList.contains("cart-btn")) {

        const id = e.target.getAttribute("data-id");
        const title = e.target.getAttribute("data-title");
        const price = parseFloat(e.target.getAttribute("data-price"));
        const image = e.target.getAttribute("data-image");

        if (!id) {
            console.log("No product ID found");
            return;
        }

        addToCart({
            id,
            title,
            price,
            image
        });
    }

});