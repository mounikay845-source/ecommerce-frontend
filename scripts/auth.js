function signup() {

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    // check empty fields
    if(name === "" || email === "" || password === ""){
        alert("Please fill all fields");
        return;
    }

    // get existing users
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // check if email already exists
    let existingUser = users.find(user => user.email === email);

    if(existingUser){
        alert("Email already registered");
        return;
    }

    // create new user
    let newUser = {
        name: name,
        email: email,
        password: password
    };

    users.push(newUser);

    // save to localStorage
    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful!");

    // redirect to login page
    window.location.href = "login.html";
}
function login(){

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let validUser = users.find(user => user.email === email && user.password === password);

    if(validUser){

        localStorage.setItem("loggedInUser", email);

        alert("Login successful");

        window.location.href = "index.html";

    } else {

        alert("Invalid email or password");

    }

}
function logout(){

    localStorage.removeItem("loggedInUser");

    alert("Logged out successfully");

    window.location.href = "login.html";

}