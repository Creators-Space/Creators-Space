// bookmarked.js

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("bookmarked-container");
  const bookmarkedCourses = JSON.parse(localStorage.getItem("bookmarkedCourses")) || [];

  if (bookmarkedCourses.length === 0) {
    container.innerHTML = "<p>No bookmarked courses yet.</p>";
    return;
  }

  bookmarkedCourses.forEach((course) => {
    const card = document.createElement("div");
    card.className = "course-card";

    card.innerHTML = `
      <img src="${course.image}" alt="${course.title}" />
      <h3 class="course-title">${course.title}</h3>
    `;

    container.appendChild(card);
  });
});
// bookmarked.js

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("bookmarked-container");
  let bookmarkedCourses = JSON.parse(localStorage.getItem("bookmarkedCourses")) || [];

  if (bookmarkedCourses.length === 0) {
    container.innerHTML = "<p>No bookmarked courses yet.</p>";
    return;
  }

  bookmarkedCourses.forEach((course, index) => {
    const card = document.createElement("div");
    card.className = "course-card";

    card.innerHTML = `
      <img src="${course.image}" alt="${course.title}" />
      <h3 class="course-title">${course.title}</h3>
      <button class="remove-btn" data-index="${index}">Remove</button>
    `;

    container.appendChild(card);
  });

  // Attach remove functionality
  const removeButtons = document.querySelectorAll(".remove-btn");

  removeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      bookmarkedCourses.splice(index, 1);
      localStorage.setItem("bookmarkedCourses", JSON.stringify(bookmarkedCourses));
      location.reload(); // Refresh to update UI
    });
  });
});
window.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("bookmarked-list");
  const bookmarks = JSON.parse(localStorage.getItem("bookmarkedCourses")) || [];

  if (bookmarks.length === 0) {
    container.innerHTML = "<p>No courses bookmarked yet.</p>";
    return;
  }

  bookmarks.forEach((course) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <button class="bookmark-btn" onclick="removeBookmark('${course.title}')">
        <i class="fa-solid fa-bookmark"></i>
      </button>
      <div class="card-content">
        <img src="${course.image}" alt="${course.title}" />
        <h3>${course.title}</h3>
        <p>Bookmarked Course</p>
      </div>
    `;

    container.appendChild(card);
  });
});
