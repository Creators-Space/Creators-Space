function toggleNav() {
  const navLinks = document.getElementById("nav-links");
  navLinks.classList.toggle("active");
}

function toggleDarkMode() {
  document.getElementById("main-body").classList.toggle("dark");
}

function toggleSyllabus(card) {
  const syllabus = card.querySelector(".syllabus");
  const enrollDiv = card.querySelector(".enroll");
  const isExpanded = card.classList.contains("expanded");

  // Close all other cards
  document.querySelectorAll(".card").forEach((c) => {
    if (c !== card) {
      c.classList.remove("expanded");
      c.querySelector(".syllabus").classList.add("hidden");
      c.querySelector(".enroll").classList.add("hidden");
    }
  });

  // Toggle current card
  if (isExpanded) {
    card.classList.remove("expanded");
    syllabus.classList.add("hidden");
    enrollDiv.classList.add("hidden");
  } else {
    card.classList.add("expanded");
    syllabus.classList.remove("hidden");
    enrollDiv.classList.remove("hidden");
  }
}

// Add scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = "running";
    }
  });
}, observerOptions);

document.querySelectorAll(".card").forEach((card) => {
  card.style.animationPlayState = "paused";
  observer.observe(card);
});

