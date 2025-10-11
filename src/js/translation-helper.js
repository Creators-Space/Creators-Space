// Helper script to batch update multiple HTML files with language support
// This script can be run to update all pages at once

const pages = [
  'bookmarked.html',
  'freelancing.html',
  'internship.html',
  'projects.html',
  'login.html',
  'signup.html',
  'profile.html',
  'enroll.html',
  'campus-ambassador.html'
];

// Standard navbar HTML with translation attributes
const translatedNavbarHTML = `
<div class="nav-links align-items-center">
  <a href="/index.html" data-translate="navbar.home">Home</a>

  <!-- dropDown 1 - About → About Us, Campus Ambassador-->
  <li class="nav-item">
    <a href="#" class="dropdown-toggle"><span data-translate="navbar.about">About</span> <i class="fa-solid fa-chevron-down arrow"></i></a>
    <div class="dropdown">
  <a href="/src/pages/about.html" data-translate="navbar.aboutUs">About Us</a>
  <a href="/src/pages/campus-ambassador.html" data-translate="navbar.campusAmbassador">Campus Ambassador</a>
    </div>
  </li> 
  <!--dropDown 2 - Programs → Courses, Internship, Services -->
  <li class="nav-item">
    <a href="#" class="dropdown-toggle"><span data-translate="navbar.programs">Programs</span> <i class="fa-solid fa-chevron-down arrow"></i></a>
    <div class="dropdown">
  <a href="/src/pages/courses.html" data-translate="navbar.courses">Courses</a>
  <a href="/src/pages/internship.html" data-translate="navbar.internship">Internship</a>
  <a href="/src/pages/services.html" data-translate="navbar.services">Services</a>
  <a href="/src/pages/freelancing.html" data-translate="navbar.freelance">Freelance</a>
    </div>
  </li>
   <!--dropDown 3 - Resources → Blog, Bookmarks, Certificates  -->
   <li class="nav-item">
    <a href="#" class="dropdown-toggle"><span data-translate="navbar.resources">Resources</span> <i class="fa-solid fa-chevron-down arrow"></i></a>
    <div class="dropdown">
  <a href="/src/pages/blog.html" data-translate="navbar.blog">Blog</a>
  <a href="/src/pages/bookmarked.html" data-translate="navbar.bookmarks">BookMarks</a>
  <a href="/src/pages/certificate.html" data-translate="navbar.certificates">Certificates</a>
    </div>
   </li> 
  <a href="/src/pages/projects.html" data-translate="navbar.projects">Projects</a>
  <a href="/src/pages/contact.html" data-translate="navbar.contact">Contact</a>
  <!-- Navbar -->
  <div id="authSection">
  <a href="/src/pages/login.html" class="btn login" data-translate="navbar.login">Log In</a>
  <a href="/src/pages/signup.html" class="btn signup" data-translate="navbar.signup">Sign Up</a>
  </div>

  <div id="userSection" style="display: none; align-items: center; gap: 10px;">
    <button id="logoutBtn" class="btn login" data-translate="navbar.logout">Logout</button>
  <a href="/src/pages/profile.html" title="Your Profile">
      <img id="profileImg" src="https://cdn-icons-png.flaticon.com/512/847/847969.png" alt="Profile" width="30"
        style="border-radius: 50%;" />
    </a>
  </div>
</div>
`;

// Instructions for manual update:
console.log(`
To manually update each page with language support:

1. Add language script to each HTML file:
   Add this line before other script tags:
  <script src="/src/js/language.js"></script>

2. Replace navbar content with translated version (see translatedNavbarHTML above)

3. Add translation attributes to main content elements:
   - Use data-translate="key.path" for text content
   - Use data-translate-html="key.path" for HTML content

Pages to update: ${pages.join(', ')}
`);

// Function to add translation attributes to common elements
function addTranslationAttributes() {
  // This function can be run in browser console on each page
  // to automatically add translation attributes to common elements
  
  const commonTranslations = {
    'Home': 'navbar.home',
    'About': 'navbar.about',
    'About Us': 'navbar.aboutUs',
    'Campus Ambassador': 'navbar.campusAmbassador',
    'Programs': 'navbar.programs',
    'Courses': 'navbar.courses',
    'Internship': 'navbar.internship',
    'Services': 'navbar.services',
    'Freelance': 'navbar.freelance',
    'Resources': 'navbar.resources',
    'Blog': 'navbar.blog',
    'BookMarks': 'navbar.bookmarks',
    'Certificates': 'navbar.certificates',
    'Projects': 'navbar.projects',
    'Contact': 'navbar.contact',
    'Log In': 'navbar.login',
    'Sign Up': 'navbar.signup',
    'Logout': 'navbar.logout',
    'Explore Our Latest Blogs':'blog.title'
  };

  // Add translation attributes to elements with matching text
  Object.entries(commonTranslations).forEach(([text, key]) => {
    const elements = Array.from(document.querySelectorAll('*')).filter(
      el => el.textContent.trim() === text && !el.querySelector('*')
    );
    
    elements.forEach(el => {
      if (!el.getAttribute('data-translate')) {
        el.setAttribute('data-translate', key);
      }
    });
  });
}

// Export for use in browser console
window.addTranslationAttributes = addTranslationAttributes;
