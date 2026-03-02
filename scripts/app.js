console.log("API Loading...");

let allProducts = [];

const productGrid = document.getElementById("productGrid");

// Fetch products from API
fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(data => {
        allProducts = data;
        displayProducts(allProducts);
    })
    .catch(err => console.log("Error:", err));


// Display products dynamically
function displayProducts(products) {

    productGrid.innerHTML = "";

    products.forEach(product => {

        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
            <button>Add to Cart</button>
        `;

        productGrid.appendChild(card);
    });
}