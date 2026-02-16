console.log("E-Commerce Website Loaded");

// Select elements
const hamburger = document.querySelector(".hamburger");
const menu = document.getElementById("menu");

// Toggle menu
hamburger.addEventListener("click", function () {
    menu.classList.toggle("active");
});
