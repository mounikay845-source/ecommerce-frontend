firebase.auth().onAuthStateChanged(function(user){

if(user){
console.log("User logged in:", user.email);
}
else{
window.location.href="login.html";
}

});