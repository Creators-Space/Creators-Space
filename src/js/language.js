// Language Management System
class LanguageManager {
    constructor() {
        this.languages = {};
        this.currentLanguage = 'en';
        this.defaultLanguage = 'en';
        this.init();
    }

    async init() {
        try {
            // Load language data
            await this.loadLanguages();
            
            // Get saved language preference or detect browser language
            const savedLanguage = localStorage.getItem('preferredLanguage') || this.detectBrowserLanguage();
            
            // Set initial language
            this.setLanguage(savedLanguage);
            
            // Initialize language selector
            this.initLanguageSelector();
            
        } catch (error) {
            console.error('Error initializing language manager:', error);
            this.setLanguage(this.defaultLanguage);
        }
    }

    async loadLanguages() {
        try {
            // Try different possible paths for the languages file
            const possiblePaths = [
                './src/data/languages.json',
                '../data/languages.json',
                '/src/data/languages.json',
                'src/data/languages.json'
            ];
            
            let response;
            for (const path of possiblePaths) {
                try {
                    response = await fetch(path);
                    if (response.ok) break;
                } catch (e) {
                    continue;
                }
            }
            
            if (!response || !response.ok) {
                throw new Error('Failed to load language data from any path');
            }
            
            this.languages = await response.json();
        } catch (error) {
            console.error('Error loading languages:', error);
            // Fallback to basic English if loading fails
            this.languages = {
                en: {
                    code: 'en',
                    name: 'English',
                    flag: '🇺🇸',
                    navbar: {
                        home: 'Home',
                        about: 'About',
                        aboutUs: 'About Us',
                        campusAmbassador: 'Campus Ambassador',
                        programs: 'Programs',
                        courses: 'Courses',
                        internship: 'Internship',
                        services: 'Services',
                        freelance: 'Freelance',
                        resources: 'Resources',
                        blog: 'Blog',
                        bookmarks: 'BookMarks',
                        certificates: 'Certificates',
                        projects: 'Projects',
                        contact: 'Contact',
                        login: 'Log In',
                        signup: 'Sign Up',
                        logout: 'Logout'
                    },
                    blogheader: {
                        title: 'Explore Our Latest Blogs'
                    }
                }
            };
        }
    }

    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0]; // Get just the language part (e.g., 'en' from 'en-US')
        
        // Check if we support the detected language
        return this.languages[langCode] ? langCode : this.defaultLanguage;
    }

    setLanguage(langCode) {
        if (!this.languages[langCode]) {
            console.warn(`Language '${langCode}' not supported, falling back to ${this.defaultLanguage}`);
            langCode = this.defaultLanguage;
        }

        this.currentLanguage = langCode;
        localStorage.setItem('preferredLanguage', langCode);
        
        // Update HTML lang attribute
        document.documentElement.lang = langCode;
        
        // Apply translations
        this.applyTranslations();
        
        // Update language selector display
        this.updateLanguageSelector();
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: langCode, translations: this.languages[langCode] } 
        }));
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getText(path) {
        const keys = path.split('.');
        let current = this.languages[this.currentLanguage];
        
        for (const key of keys) {
            if (current && current[key]) {
                current = current[key];
            } else {
                // Fallback to English if translation not found
                current = this.languages[this.defaultLanguage];
                for (const fallbackKey of keys) {
                    if (current && current[fallbackKey]) {
                        current = current[fallbackKey];
                    } else {
                        return path; // Return the path if no translation found
                    }
                }
                break;
            }
        }
        
        return current || path;
    }

    applyTranslations() {
        // Skip translation for about and contact pages as requested
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'about.html' || currentPage === 'contact.html') {
            return;
        }

        // Translate elements with data-translate attribute
        const translatableElements = document.querySelectorAll('[data-translate]');
        
        translatableElements.forEach(element => {
            const translationKey = element.getAttribute('data-translate');
            const translation = this.getText(translationKey);
            
            if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = translation;
            } else if (element.tagName === 'INPUT' && element.placeholder) {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Translate elements with data-translate-html attribute (for HTML content)
        const htmlTranslatableElements = document.querySelectorAll('[data-translate-html]');
        
        htmlTranslatableElements.forEach(element => {
            const translationKey = element.getAttribute('data-translate-html');
            const translation = this.getText(translationKey);
            element.innerHTML = translation;
        });
    }

    initLanguageSelector() {
        // Check if language selector already exists
        if (document.getElementById('language-selector')) {
            return;
        }

        // Create language selector HTML
        const languageSelector = this.createLanguageSelector();
        
        // Find the navbar and insert the language selector
        const navbar = document.querySelector('.navbar .nav-links');
        if (navbar) {
            // Insert before the auth section
            const authSection = navbar.querySelector('#authSection') || navbar.querySelector('#userSection');
            if (authSection) {
                navbar.insertBefore(languageSelector, authSection);
            } else {
                navbar.appendChild(languageSelector);
            }
        }
    }

    createLanguageSelector() {
        const selectorContainer = document.createElement('li');
        selectorContainer.className = 'nav-item';
        selectorContainer.id = 'language-selector';
        
        const currentLang = this.languages[this.currentLanguage];
        
        selectorContainer.innerHTML = `
            <a href="#" class="dropdown-toggle language-toggle"">
                <span class="flag">${currentLang.flag}</span>
                <span class="lang-name">${currentLang.name}</span>
                <i class="fa-solid fa-chevron-down arrow"></i>
            </a>
            <div class="dropdown language-dropdown">
                ${Object.entries(this.languages).map(([code, lang]) => `
                    <a href="#" class="language-option ${code === this.currentLanguage ? 'active' : ''}" 
                       data-lang="${code}">
                        <span class="flag">${lang.flag}</span>
                        <span class="lang-name">${lang.name}</span>
                    </a>
                `).join('')}
            </div>
        `;

        // Add click event listeners
        const dropdownToggle = selectorContainer.querySelector('.dropdown-toggle');
        const languageOptions = selectorContainer.querySelectorAll('.language-option');

        // Toggle dropdown on click
        dropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            selectorContainer.classList.toggle('show');
        });

        // Handle language selection
        languageOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedLang = option.getAttribute('data-lang');
                this.setLanguage(selectedLang);
                selectorContainer.classList.remove('show');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!selectorContainer.contains(e.target)) {
                selectorContainer.classList.remove('show');
            }
        });

        return selectorContainer;
    }

    updateLanguageSelector() {
        const selector = document.getElementById('language-selector');
        if (!selector) return;

        const currentLang = this.languages[this.currentLanguage];
        
        // Update the toggle display
        const toggle = selector.querySelector('.dropdown-toggle');
        const flag = toggle.querySelector('.flag');
        const langName = toggle.querySelector('.lang-name');
        
        if (flag) flag.textContent = currentLang.flag;
        if (langName) langName.textContent = currentLang.name;

        // Update active state in dropdown
        const options = selector.querySelectorAll('.language-option');
        options.forEach(option => {
            const langCode = option.getAttribute('data-lang');
            option.classList.toggle('active', langCode === this.currentLanguage);
        });
    }

    // Utility method to add translation attributes to elements
    static addTranslationAttribute(element, translationKey, isHTML = false) {
        if (isHTML) {
            element.setAttribute('data-translate-html', translationKey);
        } else {
            element.setAttribute('data-translate', translationKey);
        }
    }
}

// Initialize language manager when DOM is loaded
let languageManager;

document.addEventListener('DOMContentLoaded', () => {
    languageManager = new LanguageManager();
});

// Export for use in other scripts
window.LanguageManager = LanguageManager;
window.getLanguageManager = () => languageManager;
