let cart = JSON.parse(localStorage.getItem("cart")) || [];

let cartContainer = document.getElementById("cart-items");
let totalPrice = 0;

cart.forEach((product, index) => {

totalPrice += product.price;

let item = document.createElement("div");
item.classList.add("cart-item");

item.innerHTML = `
<img src="${product.image}">
<div class="item-details">
<div class="item-title">${product.title}</div>
<div class="item-price">$${product.price}</div>
</div>

<button class="remove-btn" onclick="removeItem(${index})">Remove</button>
`;

cartContainer.appendChild(item);

});

document.getElementById("total").innerText = totalPrice;

function removeItem(index){
cart.splice(index,1);
localStorage.setItem("cart", JSON.stringify(cart));
location.reload();
}