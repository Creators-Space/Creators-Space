function toggleDarkMode() 
{
    const element = document.getElementById("main-body");
    
    console.log(document.getElementById('main-body'));
    element.classList.toggle("dark")

}

function toggleDarkMode() {
    const element = document.getElementById("main-body");

    element.classList.toggle("dark");

    if(element.classList.contains("dark")){
        localStorage.setItem("theme","dark");
    } else{
        localStorage.setItem("theme","light");
    }
}


 if (localStorage.getItem("theme") === "dark") {
      document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("main-body")?.classList.add("dark");
      });
 }

