console.log("E-Commerce Website Loaded");

// ================= HAMBURGER MENU =================
const hamburger = document.querySelector(".hamburger");
const menu = document.getElementById("menu");

hamburger.addEventListener("click", function () {
    menu.classList.toggle("active");
});


// ================= CART SYSTEM =================
let cart = [];
const cartCount = document.getElementById("cartCount");

function updateCartCount() {
    cartCount.textContent = cart.length;
}


// ================= FETCH PRODUCTS =================
const productGrid = document.getElementById("productGrid");

fetch("https://fakestoreapi.com/products?limit=8")
    .then(response => response.json())
    .then(data => {

        data.forEach(product => {

            const card = document.createElement("div");
            card.classList.add("product-card");

            card.innerHTML = `
                <img src="${product.image}" alt="${product.title}" loading="lazy">
                <h3>${product.title.substring(0, 40)}...</h3>
                <p>$${product.price}</p>
                <button class="add-to-cart">Add to Cart</button>
            `;

            productGrid.appendChild(card);

        });

        // Add to cart buttons
        const buttons = document.querySelectorAll(".add-to-cart");

        buttons.forEach((button, index) => {
            button.addEventListener("click", () => {
                cart.push(data[index]);
                updateCartCount();
                alert("Product added to cart!");
            });
        });

    })
    .catch(error => {
        console.error("Error fetching products:", error);
        productGrid.innerHTML = "<p>Failed to load products.</p>";
    });
