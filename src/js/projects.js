// Projects Page JavaScript

class ProjectsManager {
  constructor() {
    this.projects = [];
    this.filteredProjects = [];
    this.currentView = 'grid';
    this.activeFilters = new Set();
    this.searchQuery = '';
    this.isInitialLoad = true;
    this.projectsPerRow = 3; // Assuming 3 projects per row in grid
    this.initialRows = 2;
    this.currentRows = this.initialRows;
    this.maxRows = 10; // Maximum rows to show

    // Local storage key for interactions (likes, favorites, comments)
    this.storageKey = 'cs_project_interactions';

    this.init();
  }

  async init() {
    this.setupEventListeners();
    this.setupDarkMode();
    await this.loadProjects();
    this.filteredProjects = [...this.projects];

    // Set container to grid view by default
    const container = document.getElementById('projectsContainer');
    container.className = 'projects-container grid-view';

    this.renderProjects();
    this.updateShowMoreButton();
    this.updateLastUpdated();
    this.isInitialLoad = false;
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase();
      this.filterProjects();
    });

    searchBtn.addEventListener('click', () => {
      this.filterProjects();
    });

    // Show more button
    const showMoreBtn = document.getElementById('showMoreBtn');
    if (showMoreBtn) {
      showMoreBtn.addEventListener('click', () => {
        this.showMoreProjects();
      });
    }

    // Back to top button
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    // Scroll event for back to top button
    window.addEventListener('scroll', () => {
      this.toggleBackToTopButton();
    });

    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark');
        localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
      });
    }

    // Tech stack filters toggle
    const toggleTechFilters = document.getElementById('toggleTechFilters');
    const techStackFilters = document.getElementById('techStackFilters');

    // In the setupEventListeners() method, modify the tech stack filters toggle section:
    if (toggleTechFilters && techStackFilters) {
      // Initialize as collapsed
      techStackFilters.classList.add('collapsed');
      toggleTechFilters.classList.add('collapsed');

      toggleTechFilters.addEventListener('click', () => {
        techStackFilters.classList.toggle('collapsed');
        toggleTechFilters.classList.toggle('collapsed');
      });
    }

    // Delegated interaction handlers for like/favorite and comments
    const container = document.getElementById('projectsContainer');
    if (container) {
      container.addEventListener('click', (e) => {
        const likeBtn = e.target.closest('.like-btn');
        const favBtn = e.target.closest('.fav-btn');
        const submitBtn = e.target.closest('.comment-submit');

        if (likeBtn) {
          const projectId = likeBtn.dataset.projectId;
          this.toggleLike(projectId);
          this.updateInteractionUI(projectId);
          return;
        }

        if (favBtn) {
          const projectId = favBtn.dataset.projectId;
          this.toggleFavorite(projectId);
          this.updateInteractionUI(projectId);
          return;
        }

        if (submitBtn) {
          const projectId = submitBtn.dataset.projectId;
          const section = submitBtn.closest('.comments-section');
          const input = section ? section.querySelector('.comment-input') : null;
          const text = input ? input.value.trim() : '';
          if (text) {
            this.addComment(projectId, text);
            input.value = '';
            this.renderCommentsFor(projectId);
          }
          return;
        }
      });

      // Post comment on Enter key within input
      container.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.classList.contains('comment-input')) {
          e.preventDefault();
          const input = e.target;
          const section = input.closest('.comments-section');
          const submitBtn = section ? section.querySelector('.comment-submit') : null;
          const projectId = submitBtn ? submitBtn.dataset.projectId : null;
          const text = input.value.trim();
          if (projectId && text) {
            this.addComment(projectId, text);
            input.value = '';
            this.renderCommentsFor(projectId);
          }
        }
      });
    }
  }

  setupDarkMode() {
    const checkbox = document.getElementById('dark-mode-toggle');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
      if (checkbox) checkbox.checked = true;
    }
  }

  async loadProjects() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const container = document.getElementById('projectsContainer');

    try {
      // Load projects from JSON file
      const jsonResponse = await fetch('./src/data/projects.json');
      const jsonProjects = await jsonResponse.json();

      // Load additional projects from GitHub API
      const githubProjects = await this.fetchGitHubProjects();

      // Combine and process projects
      this.projects = [
        ...jsonProjects.map(project => this.processJsonProject(project)),
        ...githubProjects.map(project => this.processGitHubProject(project))
      ];

      // Extract tech stacks for filters
      this.setupTechStackFilters();

      // Hide loading spinner
      if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
      }

    } catch (error) {
      console.error('Error loading projects:', error);
      container.innerHTML = `
        <div class="error-message">
          <h3>Error Loading Projects</h3>
          <p>Unable to load projects at this time. Please try again later.</p>
        </div>
      `;
    }
  }

  async fetchGitHubProjects() {
    try {
      // Fetch trending repositories from GitHub API
      const response = await fetch('https://api.github.com/search/repositories?q=stars:>100+language:javascript+language:python+language:java&sort=stars&order=desc&per_page=20');
      const data = await response.json();

      return data.items.map(repo => ({
        name: repo.name,
        description: repo.description || 'No description available',
        html_url: repo.html_url,
        owner: repo.owner.login,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        language: repo.language,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        topics: repo.topics || []
      }));
    } catch (error) {
      console.error('Error fetching GitHub projects:', error);
      return [];
    }
  }

  processJsonProject(project) {
    return {
      id: `json-${Math.random().toString(36).substr(2, 9)}`,
      name: project['Project name'],
      description: project['Project description'],
      url: project['Project link'],
      admin: project['Project admin'],
      adminLinkedin: project['Admin linkedin'],
      techStack: this.extractTechStack(project['Tech stack']),
      source: 'json',
      stars: 0,
      forks: 0,
      language: this.getPrimaryLanguage(project['Tech stack']),
      lastUpdated: new Date().toISOString()
    };
  }

  processGitHubProject(project) {
    return {
      id: `github-${project.name}-${project.owner}`,
      name: project.name,
      description: project.description,
      url: project.html_url,
      admin: project.owner,
      adminLinkedin: `https://github.com/${project.owner}`,
      techStack: [project.language, ...project.topics].filter(Boolean),
      source: 'github',
      stars: project.stargazers_count,
      forks: project.forks_count,
      language: project.language,
      lastUpdated: project.updated_at
    };
  }

  extractTechStack(techStackString) {
    if (!techStackString) return [];

    // Common tech stack keywords
    const techKeywords = [
      'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Python', 'Django', 'Flask',
      'JavaScript', 'TypeScript', 'HTML', 'CSS', 'MongoDB', 'PostgreSQL', 'MySQL',
      'Firebase', 'AWS', 'Docker', 'Kubernetes', 'Git', 'GitHub', 'Tailwind',
      'Bootstrap', 'Material-UI', 'Redux', 'Vuex', 'GraphQL', 'REST', 'API',
      'Machine Learning', 'AI', 'TensorFlow', 'PyTorch', 'Scikit-learn',
      'Java', 'Spring', 'Kotlin', 'Swift', 'Flutter', 'React Native'
    ];

    const extracted = [];
    const lowerTechStack = techStackString.toLowerCase();

    techKeywords.forEach(keyword => {
      if (lowerTechStack.includes(keyword.toLowerCase())) {
        extracted.push(keyword);
      }
    });

    return extracted.length > 0 ? extracted : ['Web Development'];
  }

  getPrimaryLanguage(techStackString) {
    if (!techStackString) return 'Unknown';

    const languages = ['JavaScript', 'Python', 'Java', 'TypeScript', 'PHP', 'C++', 'C#', 'Go', 'Rust'];

    for (const lang of languages) {
      if (techStackString.toLowerCase().includes(lang.toLowerCase())) {
        return lang;
      }
    }

    return 'Web Development';
  }

  setupTechStackFilters() {
    const techStacks = new Set();

    this.projects.forEach(project => {
      project.techStack.forEach(tech => {
        techStacks.add(tech);
      });
    });


    const filterContainer = document.getElementById('techStackFilters');
    const sortedTechStacks = Array.from(techStacks).sort();

    filterContainer.innerHTML = `
      <button class="tech-filter" data-tech="all">All</button>
      ${sortedTechStacks.map(tech => `
        <button class="tech-filter" data-tech="${tech}">${tech}</button>
      `).join('')}
    `;
    this.activeFilters.clear();

    // Add event listeners to tech stack filters
    filterContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('tech-filter')) {
        const tech = e.target.dataset.tech;

        if (tech === 'all') {
          // Clear all filters and remove active class from all buttons
          this.activeFilters.clear();
          filterContainer.querySelectorAll('.tech-filter').forEach(btn => {
            btn.classList.remove('active');
          });
          e.target.classList.add('active');
        } else {
          // Remove active class from "All" button
          filterContainer.querySelector('.tech-filter[data-tech="all"]').classList.remove('active');

          // Toggle the clicked filter
          if (this.activeFilters.has(tech)) {
            this.activeFilters.delete(tech);
            e.target.classList.remove('active');
          } else {
            this.activeFilters.add(tech);
            e.target.classList.add('active');
          }

          // If no filters are selected, activate "All"
          if (this.activeFilters.size === 0) {
            filterContainer.querySelector('.tech-filter[data-tech="all"]').classList.add('active');
          }
        }

        this.filterProjects();
      }
    });
  }

  filterProjects() {
    this.filteredProjects = this.projects.filter(project => {
      // Search filter
      const matchesSearch = !this.searchQuery ||
        project.name.toLowerCase().includes(this.searchQuery) ||
        project.description.toLowerCase().includes(this.searchQuery) ||
        project.admin.toLowerCase().includes(this.searchQuery) ||
        project.techStack.every(tech => tech.toLowerCase().includes(this.searchQuery));

      // Tech stack filter (AND logic - project must have ALL selected technologies)
      const matchesTechStack = this.activeFilters.size === 0 ||
        Array.from(this.activeFilters).every(selectedTech =>
          project.techStack.some(tech => tech.toLowerCase() === selectedTech.toLowerCase())
        );


      return matchesSearch && matchesTechStack;
    });

    // Reset to initial rows when filtering
    this.currentRows = this.initialRows;
    this.renderProjects();
    this.updateShowMoreButton();
  }


  showMoreProjects() {
    this.currentRows++;
    this.renderProjects();
    this.updateShowMoreButton();
  }

  toggleBackToTopButton() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  updateShowMoreButton() {
    const showMoreBtn = document.getElementById('showMoreBtn');
    if (showMoreBtn) {
      const maxProjects = this.projectsPerRow * this.maxRows;
      const currentProjects = this.projectsPerRow * this.currentRows;

      if (currentProjects >= this.filteredProjects.length || currentProjects >= maxProjects) {
        showMoreBtn.disabled = true;
        showMoreBtn.innerHTML = '<span>No More Projects</span>';
      } else {
        showMoreBtn.disabled = false;
        showMoreBtn.innerHTML = `
          <span>Show More</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        `;
      }
    }
  }

  renderProjects() {
    const container = document.getElementById('projectsContainer');

    if (this.filteredProjects.length === 0) {
      container.innerHTML = `
      <div class="no-results">
        <h3>No projects found</h3>
        <p>Try adjusting your search or filters to find more projects.</p>
      </div>
    `;
      return;
    }
    // Calculate how many projects to show
    const projectsToShow = Math.min(
      this.projectsPerRow * this.currentRows,
      this.filteredProjects.length
    );

    // Get the projects to display
    const projectsToDisplay = this.filteredProjects.slice(0, projectsToShow);

    container.innerHTML = projectsToDisplay.map(project =>
      this.createProjectCard(project)
    ).join('');

    // After render, sync interaction UI and comments for visible cards
    projectsToDisplay.forEach((project) => {
      this.updateInteractionUI(project.id);
      this.renderCommentsFor(project.id);
    });
  }

  createProjectCard(project) {
    const techTags = project.techStack.map(tech =>
      `<span class="tech-tag">${tech}</span>`
    ).join('');

    const adminInitials = project.admin.split(' ').map(name => name[0]).join('').toUpperCase();

    const githubStats = project.source === 'github' ? `
      <div class="github-stats">
        <div class="stat-item">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 .25a.75.75 0 0 1 .673.418l3.058 6.13c.042.084.061.18.061.273 0 .313-.253.567-.567.567H9.5v3.75a.75.75 0 0 1-1.5 0V7.5H5.567a.567.567 0 0 1-.567-.567c0-.093.02-.189.061-.273L8.327.668A.75.75 0 0 1 8 .25Z"/>
          </svg>
          ${project.stars}
        </div>
        <div class="stat-item">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0 0 4.244 2.25 2.25 0 0 0 0-4.244ZM7.5 5.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 7.25a2.25 2.25 0 1 0 0 4.244 2.25 2.25 0 0 0 0-4.244ZM9.5 5.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.5 7.25a2.25 2.25 0 1 0 0 4.244 2.25 2.25 0 0 0 0-4.244ZM11.5 5.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM11.5 7.25a2.25 2.25 0 1 0 0 4.244 2.25 2.25 0 0 0 0-4.244ZM13.5 5.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM13.5 7.25a2.25 2.25 0 1 0 0 4.244 2.25 2.25 0 0 0 0-4.244Z"/>
          </svg>
          ${project.forks}
        </div>
      </div>
    ` : '';

    return `
      <div class="project-card" data-project-id="${project.id}">
        <div class="project-header">
          <div class="project-icon">
            ${project.name.charAt(0).toUpperCase()}
          </div>
          <div class="project-info">
            <h3 class="project-title">${project.name}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-meta">
              <div class="project-admin">
                <div class="admin-avatar">${adminInitials}</div>
                <span>${project.admin}</span>
              </div>
            </div>
            <div class="tech-stack">
              ${techTags}
            </div>
            <div class="project-actions">
              <a href="${project.url}" target="_blank" class="project-link">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                </svg>
                View Project
              </a>
              <button class="like-btn" data-project-id="${project.id}" aria-pressed="false">
                <span class="like-icon">❤</span>
                <span class="like-text">Like</span>
              </button>
              <button class="fav-btn" data-project-id="${project.id}" aria-pressed="false">
                <span class="fav-icon">★</span>
                <span class="fav-text">Favorite</span>
              </button>
            </div>
            ${githubStats}
            <div class="comments-section" data-project-id="${project.id}">
              <div class="comments-header">Comments</div>
              <div class="comments-list"></div>
              <div class="comment-form">
                <input class="comment-input" type="text" placeholder="Add a comment..." maxlength="300" />
                <button class="comment-submit" data-project-id="${project.id}">Post</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  updateLastUpdated() {
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement) {
      const now = new Date();
      lastUpdatedElement.textContent = now.toLocaleTimeString();
    }
  }
}


// Initialize the projects manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ProjectsManager();
});

// === Interaction State Helpers and Renderers ===
ProjectsManager.prototype.getAllInteractions = function() {
  try {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

ProjectsManager.prototype.saveAllInteractions = function(all) {
  try {
    localStorage.setItem(this.storageKey, JSON.stringify(all));
  } catch (e) {
    // ignore quota errors silently
  }
};

ProjectsManager.prototype.ensureProjectInteraction = function(projectId) {
  const all = this.getAllInteractions();
  if (!all[projectId]) {
    all[projectId] = { liked: false, favorited: false, comments: [] };
    this.saveAllInteractions(all);
  }
  return all;
};

ProjectsManager.prototype.toggleLike = function(projectId) {
  const all = this.ensureProjectInteraction(projectId);
  all[projectId].liked = !all[projectId].liked;
  this.saveAllInteractions(all);
};

ProjectsManager.prototype.toggleFavorite = function(projectId) {
  const all = this.ensureProjectInteraction(projectId);
  all[projectId].favorited = !all[projectId].favorited;
  this.saveAllInteractions(all);
};

ProjectsManager.prototype.addComment = function(projectId, text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const all = this.ensureProjectInteraction(projectId);
  const comment = { id: Date.now(), text: trimmed, ts: new Date().toISOString() };
  all[projectId].comments.unshift(comment);
  // Keep only last 100 to avoid unbounded growth
  if (all[projectId].comments.length > 100) {
    all[projectId].comments = all[projectId].comments.slice(0, 100);
  }
  this.saveAllInteractions(all);
};

ProjectsManager.prototype.updateInteractionUI = function(projectId) {
  const all = this.ensureProjectInteraction(projectId);
  const card = document.querySelector(`.project-card[data-project-id="${projectId}"]`);
  if (!card) return;
  const likeBtn = card.querySelector('.like-btn');
  const favBtn = card.querySelector('.fav-btn');
  if (likeBtn) {
    likeBtn.classList.toggle('active', !!all[projectId].liked);
    likeBtn.setAttribute('aria-pressed', all[projectId].liked ? 'true' : 'false');
    likeBtn.querySelector('.like-icon').textContent = all[projectId].liked ? '❤' : '♡';
    likeBtn.querySelector('.like-text').textContent = all[projectId].liked ? 'Liked' : 'Like';
  }
  if (favBtn) {
    favBtn.classList.toggle('active', !!all[projectId].favorited);
    favBtn.setAttribute('aria-pressed', all[projectId].favorited ? 'true' : 'false');
    favBtn.querySelector('.fav-icon').textContent = all[projectId].favorited ? '★' : '☆';
    favBtn.querySelector('.fav-text').textContent = all[projectId].favorited ? 'Favorited' : 'Favorite';
  }
};

ProjectsManager.prototype.renderCommentsFor = function(projectId) {
  const all = this.ensureProjectInteraction(projectId);
  const card = document.querySelector(`.project-card[data-project-id="${projectId}"]`);
  if (!card) return;
  const listEl = card.querySelector('.comments-list');
  if (!listEl) return;
  if (!all[projectId].comments.length) {
    listEl.innerHTML = '<div class="no-comments">Be the first to comment.</div>';
    return;
  }
  listEl.innerHTML = all[projectId].comments.map(c => {
    const date = new Date(c.ts);
    const timeStr = isNaN(date.getTime()) ? '' : date.toLocaleString();
    return `
      <div class="comment-item">
        <div class="comment-text">${this.escapeHtml(c.text)}</div>
        <div class="comment-meta">${timeStr}</div>
      </div>
    `;
  }).join('');
};

ProjectsManager.prototype.escapeHtml = function(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

    const languages = ['JavaScript', 'Python', 'Java', 'TypeScript', 'PHP', 'C++', 'C#', 'Go', 'Rust'];



    for (const lang of languages) {

      if (techStackString.toLowerCase().includes(lang.toLowerCase())) {

        return lang;

      }

    }



    return 'Web Development';

  }



  setupTechStackFilters() {

    const techStacks = new Set();



    this.projects.forEach(project => {

      project.techStack.forEach(tech => {

        techStacks.add(tech);

      });

    });





    const filterContainer = document.getElementById('techStackFilters');

    const sortedTechStacks = Array.from(techStacks).sort();



    filterContainer.innerHTML = `

      <button class="tech-filter" data-tech="all">All</button>

      ${sortedTechStacks.map(tech => `

        <button class="tech-filter" data-tech="${tech}">${tech}</button>

      `).join('')}

    `;

    this.activeFilters.clear();



    // Add event listeners to tech stack filters

    filterContainer.addEventListener('click', (e) => {

      if (e.target.classList.contains('tech-filter')) {

        const tech = e.target.dataset.tech;



        if (tech === 'all') {

          // Clear all filters and remove active class from all buttons

          this.activeFilters.clear();

          filterContainer.querySelectorAll('.tech-filter').forEach(btn => {

            btn.classList.remove('active');

          });

          e.target.classList.add('active');

        } else {

          // Remove active class from "All" button

          filterContainer.querySelector('.tech-filter[data-tech="all"]').classList.remove('active');



          // Toggle the clicked filter

          if (this.activeFilters.has(tech)) {

            this.activeFilters.delete(tech);

            e.target.classList.remove('active');

          } else {

            this.activeFilters.add(tech);

            e.target.classList.add('active');

          }



          // If no filters are selected, activate "All"

          if (this.activeFilters.size === 0) {

            filterContainer.querySelector('.tech-filter[data-tech="all"]').classList.add('active');

          }

        }



        this.filterProjects();

      }

    });

  }



  filterProjects() {

    this.filteredProjects = this.projects.filter(project => {

      // Search filter

      const matchesSearch = !this.searchQuery ||

        project.name.toLowerCase().includes(this.searchQuery) ||

        project.description.toLowerCase().includes(this.searchQuery) ||

        project.admin.toLowerCase().includes(this.searchQuery) ||

        project.techStack.every(tech => tech.toLowerCase().includes(this.searchQuery));



      // Tech stack filter (AND logic - project must have ALL selected technologies)

      const matchesTechStack = this.activeFilters.size === 0 ||

        Array.from(this.activeFilters).every(selectedTech =>

          project.techStack.some(tech => tech.toLowerCase() === selectedTech.toLowerCase())

        );





      return matchesSearch && matchesTechStack;

    });



    // Reset to initial rows when filtering

    this.currentRows = this.initialRows;

    this.renderProjects();

    this.updateShowMoreButton();

  }





  showMoreProjects() {

    this.currentRows++;

    this.renderProjects();

    this.updateShowMoreButton();

  }



  toggleBackToTopButton() {

    const backToTopBtn = document.getElementById('backToTopBtn');

    if (backToTopBtn) {

      if (window.pageYOffset > 300) {

        backToTopBtn.classList.add('visible');

      } else {

        backToTopBtn.classList.remove('visible');

      }

    }

  }



  updateShowMoreButton() {

    const showMoreBtn = document.getElementById('showMoreBtn');

    if (showMoreBtn) {

      const maxProjects = this.projectsPerRow * this.maxRows;

      const currentProjects = this.projectsPerRow * this.currentRows;



      if (currentProjects >= this.filteredProjects.length || currentProjects >= maxProjects) {

        showMoreBtn.disabled = true;

        showMoreBtn.innerHTML = '<span>No More Projects</span>';

      } else {

        showMoreBtn.disabled = false;

        showMoreBtn.innerHTML = `

          <span>Show More</span>

          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">

            <polyline points="6,9 12,15 18,9"></polyline>

          </svg>

        `;

      }

    }

  }



  renderProjects() {

    const container = document.getElementById('projectsContainer');



    if (this.filteredProjects.length === 0) {

      container.innerHTML = `

      <div class="no-results">

        <h3>No projects found</h3>

        <p>Try adjusting your search or filters to find more projects.</p>

      </div>

    `;

      return;

    }

    // Calculate how many projects to show

    const projectsToShow = Math.min(

      this.projectsPerRow * this.currentRows,

      this.filteredProjects.length

    );



    // Get the projects to display

    const projectsToDisplay = this.filteredProjects.slice(0, projectsToShow);



    container.innerHTML = projectsToDisplay.map(project =>

      this.createProjectCard(project)

    ).join('');

  }



  createProjectCard(project) {

    const techTags = project.techStack.map(tech =>

      `<span class="tech-tag">${tech}</span>`

    ).join('');



    const adminInitials = project.admin.split(' ').map(name => name[0]).join('').toUpperCase();



    const githubStats = project.source === 'github' ? `

      <div class="github-stats">

        <div class="stat-item">

          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">

            <path d="M8 .25a.75.75 0 0 1 .673.418l3.058 6.13c.042.084.061.18.061.273 0 .313-.253.567-.567.567H9.5v3.75a.75.75 0 0 1-1.5 0V7.5H5.567a.567.567 0 0 1-.567-.567c0-.093.02-.189.061-.273L8.327.668A.75.75 0 0 1 8 .25Z"/>

          </svg>

          ${project.stars}

        </div>

        <div class="stat-item">

          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">

            <path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0 0 4.244 2.25 2.25 0 0 0 0-4.244ZM7.5 5.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 7.25a2.25 2.25 0 1 0 0 4.244 2.25 2.25 0 0 0 0-4.244ZM9.5 5.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.5 7.25a2.25 2.25 0 1 0 0 4.244 2.25 2.25 0 0 0 0-4.244ZM11.5 5.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM11.5 7.25a2.25 2.25 0 1 0 0 4.244 2.25 2.25 0 0 0 0-4.244ZM13.5 5.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM13.5 7.25a2.25 2.25 0 1 0 0 4.244 2.25 2.25 0 0 0 0-4.244Z"/>

          </svg>

          ${project.forks}

        </div>

      </div>

    ` : '';



    return `

      <div class="project-card">

        <div class="project-header">

          <div class="project-icon">

            ${project.name.charAt(0).toUpperCase()}

          </div>

          <div class="project-info">

            <h3 class="project-title">${project.name}</h3>

            <p class="project-description">${project.description}</p>

            <div class="project-meta">

              <div class="project-admin">

                <div class="admin-avatar">${adminInitials}</div>

                <span>${project.admin}</span>

              </div>

            </div>

            <div class="tech-stack">

              ${techTags}

            </div>

            <div class="project-actions">

              <a href="${project.url}" target="_blank" class="project-link">

                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">

                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>

                </svg>

                View Project

              </a>

            </div>

            ${githubStats}

          </div>

        </div>

      </div>

    `;

  }



  updateLastUpdated() {

    const lastUpdatedElement = document.getElementById('lastUpdated');

    if (lastUpdatedElement) {

      const now = new Date();

      lastUpdatedElement.textContent = now.toLocaleTimeString();

    }

  }

}





// Initialize the projects manager when the DOM is loaded

document.addEventListener('DOMContentLoaded', () => {

  new ProjectsManager();

});
