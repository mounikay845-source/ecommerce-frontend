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