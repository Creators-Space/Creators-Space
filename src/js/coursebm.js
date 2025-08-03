
document.addEventListener("DOMContentLoaded", () => {
  const bookmarkButtons = document.querySelectorAll(".bookmark-btn");

  bookmarkButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const courseCard = button.closest(".course-card");
      const courseTitle = courseCard.querySelector(".course-title").textContent;
      const courseImage = courseCard.querySelector("img").src;

      const bookmarkedCourses = JSON.parse(localStorage.getItem("bookmarkedCourses")) || [];

      const exists = bookmarkedCourses.some(course => course.title === courseTitle);

      if (!exists) {
        bookmarkedCourses.push({
          title: courseTitle,
          image: courseImage,
        });
        localStorage.setItem("bookmarkedCourses", JSON.stringify(bookmarkedCourses));
        alert("Course bookmarked!");
      } else {
        alert("Course is already bookmarked.");
      }
    });
  });
});
bookmarkBtn.innerHTML = courseIsBookmarked ? 
  '<i class="fa-solid fa-bookmark"></i>' : 
  '<i class="fa-regular fa-bookmark"></i>';
function toggleBookmark(event, btn) {
  event.stopPropagation(); // Prevent triggering toggleSyllabus

  const card = btn.closest(".card");
  const title = card.getAttribute("data-title");
  const image = card.getAttribute("data-image");

  let bookmarks = JSON.parse(localStorage.getItem("bookmarkedCourses")) || [];

  const index = bookmarks.findIndex((c) => c.title === title);

  if (index === -1) {
    // Not bookmarked, add
    bookmarks.push({ title, image });
    btn.innerHTML = '<i class="fa-solid fa-bookmark"></i>';
  } else {
    // Already bookmarked, remove
    bookmarks.splice(index, 1);
    btn.innerHTML = '<i class="fa-regular fa-bookmark"></i>';
  }

  localStorage.setItem("bookmarkedCourses", JSON.stringify(bookmarks));
}

// On page load, set icons correctly
window.addEventListener("DOMContentLoaded", () => {
  const bookmarks = JSON.parse(localStorage.getItem("bookmarkedCourses")) || [];
  document.querySelectorAll(".card").forEach((card) => {
    const title = card.getAttribute("data-title");
    const btn = card.querySelector(".bookmark-btn");

    const isBookmarked = bookmarks.some((c) => c.title === title);
    btn.innerHTML = isBookmarked
      ? '<i class="fa-solid fa-bookmark"></i>'
      : '<i class="fa-regular fa-bookmark"></i>';
  });
});
