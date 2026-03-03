let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.getElementById("cartItems");
const totalPrice = document.getElementById("totalPrice");

let total = 0;

cart.forEach((item, index) => {
    const div = document.createElement("div");

    div.innerHTML = `
        <img src="${item.image}" width="80">
        <p>${item.title}</p>
        <p>$${item.price}</p>
        <button onclick="removeItem(${index})">Remove</button>
    `;

    total += item.price;
    cartItems.appendChild(div);
});

totalPrice.textContent = total.toFixed(2);

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    location.reload();
}
/* ================= CART PAGE ================= */

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cartCount").innerText = totalItems;
}

function calculateTotal(cart) {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
}

function renderCart() {

    const cart = getCart();
    const container = document.getElementById("cartItems");
    const totalElement = document.getElementById("cartTotal");
    const checkoutBtn = document.getElementById("checkoutBtn");

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        totalElement.innerText = "0";
        checkoutBtn.disabled = true;
        return;
    }

    checkoutBtn.disabled = false;

    cart.forEach(item => {

        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <img src="${item.image}" class="cart-img">
            <div class="cart-info">
               <h4>${item.title || item.name}</h4>
                <p>$${item.price}</p>

                <div class="quantity-controls">
                    <button class="decrease" data-id="${item.id}">−</button>
                    <span>${item.quantity}</span>
                    <button class="increase" data-id="${item.id}">+</button>
                </div>

                <button class="remove-btn" data-id="${item.id}">Remove</button>
            </div>
        `;

        container.appendChild(div);
    });

    totalElement.innerText = calculateTotal(cart);
}

function updateQuantity(id, change) {

    let cart = getCart();
    const item = cart.find(p => p.id == id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity < 1) {
        item.quantity = 1;
    }

    saveCart(cart);
    renderCart();
    updateCartCount();
}

function removeItem(id) {

    let cart = getCart();
    cart = cart.filter(item => item.id != id);

    saveCart(cart);
    renderCart();
    updateCartCount();
}

document.addEventListener("click", function (e) {

    if (e.target.classList.contains("increase")) {
        updateQuantity(e.target.dataset.id, 1);
    }

    if (e.target.classList.contains("decrease")) {
        updateQuantity(e.target.dataset.id, -1);
    }

    if (e.target.classList.contains("remove-btn")) {
        removeItem(e.target.dataset.id);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    renderCart();
    updateCartCount();
});