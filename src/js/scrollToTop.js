// scrollToTop.js

const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    scrollTopBtn.classList.add("show");
    scrollTopBtn.classList.add("bounce");
  } else {
    scrollTopBtn.classList.remove("show");
    scrollTopBtn.classList.remove("bounce"); 
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
