document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.querySelector("input[type='checkbox']");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    checkbox.checked = true;
  }

  checkbox?.addEventListener("change", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  });
});
