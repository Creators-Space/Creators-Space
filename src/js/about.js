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

// FAQ Accordion Functionality
function toggleFaq(element) {
  const faqItem = element.parentElement;
  const faqAnswer = faqItem.querySelector('.faq-answer');
  const isActive = faqItem.classList.contains('active');
  
  // Close all other FAQ items
  document.querySelectorAll('.faq-item').forEach(item => {
    if (item !== faqItem) {
      item.classList.remove('active');
    }
  });
  
  // Toggle current FAQ item
  if (isActive) {
    faqItem.classList.remove('active');
  } else {
    faqItem.classList.add('active');
  }
}

// FAQ Search Functionality
function initFaqSearch() {
  const searchInput = document.getElementById('faq-search');
  const faqItems = document.querySelectorAll('.faq-item');
  const noResultsDiv = document.getElementById('faq-no-results');
  
  if (!searchInput) return;
  
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim();
    let visibleItems = 0;
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question span').textContent.toLowerCase();
      const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
      const keywords = item.getAttribute('data-keywords') || '';
      
      const isMatch = question.includes(searchTerm) || 
                     answer.includes(searchTerm) || 
                     keywords.includes(searchTerm);
      
      if (searchTerm === '' || isMatch) {
        item.style.display = 'block';
        visibleItems++;
      } else {
        item.style.display = 'none';
        item.classList.remove('active'); // Close if hidden
      }
    });
    
    // Show/hide no results message
    if (visibleItems === 0 && searchTerm !== '') {
      noResultsDiv.style.display = 'block';
    } else {
      noResultsDiv.style.display = 'none';
    }
  });
}

// Keyboard accessibility for FAQ
document.addEventListener('DOMContentLoaded', function() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFaq(this);
      }
    });
  });
  
  // Initialize FAQ search
  initFaqSearch();
});

// Smooth scroll to FAQ section from external links
function scrollToFaq() {
  const faqSection = document.querySelector('.faq-section');
  if (faqSection) {
    faqSection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Auto-open FAQ item based on URL hash
function handleFaqHash() {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#faq-')) {
    const faqIndex = parseInt(hash.replace('#faq-', '')) - 1;
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems[faqIndex]) {
      // Scroll to FAQ section first
      setTimeout(() => {
        scrollToFaq();
        // Then open the specific FAQ item
        setTimeout(() => {
          const faqQuestion = faqItems[faqIndex].querySelector('.faq-question');
          if (faqQuestion) {
            toggleFaq(faqQuestion);
          }
        }, 500);
      }, 100);
    }
  }
}

// Initialize FAQ hash handling
document.addEventListener('DOMContentLoaded', handleFaqHash);
window.addEventListener('hashchange', handleFaqHash);