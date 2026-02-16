console.log("Script Loaded");

// ================= HAMBURGER =================
const hamburger = document.querySelector(".hamburger");
const menu = document.getElementById("menu");

if (hamburger) {
    hamburger.addEventListener("click", function () {
        menu.classList.toggle("active");
    });
}

// ================= CART + SEARCH =================
let allProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount = document.getElementById("cartCount");
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");

if (cartCount) {
    cartCount.textContent = cart.length;
}

// ================= FETCH PRODUCTS =================
fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(data => {
        allProducts = data;
        displayProducts(allProducts);
    })
    .catch(error => console.log("API Error:", error));

// ================= DISPLAY FUNCTION =================
function displayProducts(products) {
    productGrid.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <img src="${product.image}" loading="lazy">
            <h3>${product.title.substring(0, 40)}...</h3>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;

        productGrid.appendChild(card);
    });
}

// ================= ADD TO CART =================
function addToCart(id) {
    const product = allProducts.find(p => p.id === id);
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    cartCount.textContent = cart.length;
    alert("Product added!");
}

// ================= SEARCH =================
if (searchInput) {
    searchInput.addEventListener("input", function () {
        const value = this.value.toLowerCase();

        const filtered = allProducts.filter(product =>
            product.title.toLowerCase().includes(value)
        );

        displayProducts(filtered);
    });
}
