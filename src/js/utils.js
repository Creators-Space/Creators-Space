function toggleDarkMode() {
    const element = document.getElementById("main-body");
    const logo = document.getElementById("navbar-logo"); // Get logo element

    element.classList.toggle("dark");

    if (element.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        logo.src = "./assets/images/logo-nav-dark.png"; // Dark mode logo
    } else {
        localStorage.setItem("theme", "light");
        logo.src = "./assets/images/logo-nav-light.png"; // Light mode logo
    }
}

// Load saved theme on page load
document.addEventListener("DOMContentLoaded", function () {
    const element = document.getElementById("main-body");
    const logo = document.getElementById("navbar-logo");

    if (localStorage.getItem("theme") === "dark") {
        element.classList.add("dark");
        logo.src = "./assets/images/logo-nav-dark.png";
    } else {
        logo.src = "./assets/images/logo-nav-light.png";
    }
});
