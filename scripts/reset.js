function resetPassword(){

    let email = document.getElementById("email").value;
    let newPassword = document.getElementById("newPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(u => u.email === email);

    if(!user){
        alert("Email not found");
        return;
    }

    user.password = newPassword;

    localStorage.setItem("users", JSON.stringify(users));

    alert("Password reset successful!");

    window.location.href = "login.html";
}