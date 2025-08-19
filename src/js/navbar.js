const toggleNav = () => {
    var navLinks = document.querySelector(".nav-links");
    var bargerLogo = document.querySelector("#navbar-barger-logo");
    var crossLogo = document.querySelector("#navbar-x-logo");
    navLinks.classList.toggle("active");

    crossLogo.classList.toggle('d-none');
    bargerLogo.classList.toggle('d-none');
//  if (element.classList.contains("dark")) {
//         localStorage.setItem("theme", "dark");
//         logo.src = "./assets/images/logo-nav-dark.png"; // Dark mode logo
//     } else {
//         localStorage.setItem("theme", "light");
//         logo.src = "./assets/images/logo-nav-light.png"; // Light mode logo
//     }

}