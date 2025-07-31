const totalLessons = 10;
let completedLessons = localStorage.getItem('completedLessons') || 0;

function updateProgressBar() {
  const percentage = (completedLessons / totalLessons) * 100;
  document.getElementById('progress-bar').style.width = percentage + '%';
  document.getElementById('progress-text').innerText = `${Math.round(percentage)}% completed`;
}

function completeLesson() {
  if (completedLessons < totalLessons) {
    completedLessons++;
    localStorage.setItem('completedLessons', completedLessons);
    updateProgressBar();
  }
}

// Run on load
window.onload = updateProgressBar;
