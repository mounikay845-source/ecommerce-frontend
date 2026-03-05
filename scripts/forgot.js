function sendResetLink() {

let email = document.getElementById("resetEmail").value;

let users = JSON.parse(localStorage.getItem("users")) || [];

let user = users.find(u => u.email === email);

if(user){

let resetLink = "reset.html?email=" + email;

document.getElementById("resetMessage").innerHTML =
"Reset Link Generated:<br><a href='"+resetLink+"'>Click here to reset password</a>";

}
else{
document.getElementById("resetMessage").innerHTML =
"Email not found!";
}

}