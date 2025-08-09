const texts = ["Vision", "Core Values" , "Mision" ,"Team" , "Stats"];
let currentIndex = 0;
let charIndex = 0;
let isDeleting = false;
const speed = 100;
const pauseTime = 1000;
const target = document.getElementById("typeTarget");

function typeLoop() {
  const currentText = texts[currentIndex];
  
  if (isDeleting) {
    target.textContent = currentText.substring(0, charIndex--);
  } else {
    target.textContent = currentText.substring(0, charIndex++);
  }

  if (!isDeleting && charIndex === currentText.length + 1) {
    setTimeout(() => { isDeleting = true; typeLoop(); }, pauseTime);
    return;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    currentIndex = (currentIndex + 1) % texts.length;
  }

  setTimeout(typeLoop, isDeleting ? speed / 2 : speed);
}

typeLoop(); // Start animation 