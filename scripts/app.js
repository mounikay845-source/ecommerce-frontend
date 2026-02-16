console.log("E-Commerce Website Loaded");

// Select elements
const hamburger = document.querySelector(".hamburger");
const menu = document.getElementById("menu");

// Toggle menu
hamburger.addEventListener("click", function () {
    menu.classList.toggle("active");
});
// ================= PRODUCT DATA =================
const products = [
    {
        name: "Wireless Headphones",
        price: "$99",
        image: "assets/headp.webp"
    },
    {
        name: "Smart Watch",
        price: "$149",
        image: "assets/smartw.jpg"
    },
    {
        name: "Bluetooth Speaker",
        price: "$79",
        image: "assets/sblutooth.webp"
    },
    {
        name: "Gaming Mouse",
        price: "$49",
        image: "assets/mouse.jpg"
    }
];

// ================= LOAD PRODUCTS =================
const productGrid = document.getElementById("productGrid");

products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.price}</p>
        <button>Add to Cart</button>
    `;

    productGrid.appendChild(card);
});

