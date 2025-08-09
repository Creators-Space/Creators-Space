const toggleNav = () => {
    var navLinks = document.querySelector(".nav-links");
    var bargerLogo = document.querySelector("#navbar-barger-logo");
    var crossLogo = document.querySelector("#navbar-x-logo");
    navLinks.classList.toggle("active");

    crossLogo.classList.toggle('d-none');
    bargerLogo.classList.toggle('d-none');
}
document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            // Remove user data from localStorage
            localStorage.removeItem("loggedInUser");
            // Redirect to login page
            window.location.href = "index.html";
        });
    }
});
window.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    const userSection = document.getElementById("userSection");
    const authSection = document.getElementById("authSection");
    const userName = document.getElementById("userName");

    if (isLoggedIn && user) {
        userSection.style.display = "flex";
        authSection.style.display = "none";
        userName.textContent = `Hi, ${user.name}`;
    } else {
        userSection.style.display = "none";
        authSection.style.display = "flex";
    }




});
