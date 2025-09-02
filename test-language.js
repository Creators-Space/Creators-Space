// Test script to verify language functionality
// You can run this in the browser console to check if everything is working

console.log('Testing Multi-Language Functionality...');

// Check if language manager is loaded
if (typeof window.getLanguageManager === 'function') {
    const langManager = window.getLanguageManager();
    if (langManager) {
        console.log('✅ Language Manager loaded successfully');
        console.log('Current language:', langManager.getCurrentLanguage());
        console.log('Available languages:', Object.keys(langManager.languages));
        
        // Test language switching
        const testLanguages = ['hi', 'es', 'fr', 'en'];
        testLanguages.forEach((lang, index) => {
            setTimeout(() => {
                console.log(`Switching to ${lang}...`);
                langManager.setLanguage(lang);
                
                // Check if some translations are applied
                const homeLink = document.querySelector('[data-translate="navbar.home"]');
                if (homeLink) {
                    console.log(`✅ Navbar translation working: ${homeLink.textContent}`);
                } else {
                    console.log('❌ Navbar translation not found');
                }
                
                // Check if language selector shows correct language
                const langSelector = document.querySelector('#language-selector .lang-name');
                if (langSelector) {
                    console.log(`✅ Language selector updated: ${langSelector.textContent}`);
                } else {
                    console.log('❌ Language selector not found');
                }
            }, index * 2000);
        });
        
    } else {
        console.log('❌ Language Manager not initialized');
    }
} else {
    console.log('❌ Language Manager not found');
}

// Check if language selector exists in navbar
const langSelector = document.querySelector('#language-selector');
if (langSelector) {
    console.log('✅ Language selector found in navbar');
} else {
    console.log('❌ Language selector not found in navbar');
}

// Check if translation attributes exist
const translatableElements = document.querySelectorAll('[data-translate]');
console.log(`Found ${translatableElements.length} translatable elements`);

if (translatableElements.length > 0) {
    console.log('✅ Translation attributes found');
    // Show first few translation keys
    const keys = Array.from(translatableElements).slice(0, 5).map(el => el.getAttribute('data-translate'));
    console.log('Sample translation keys:', keys);
} else {
    console.log('❌ No translation attributes found');
}

// Check if language data loaded
fetch('./src/data/languages.json')
    .then(response => response.json())
    .then(data => {
        console.log('✅ Language data loaded successfully');
        console.log('Available languages:', Object.keys(data));
    })
    .catch(error => {
        console.log('❌ Error loading language data:', error);
    });

console.log('Language functionality test completed. Check results above.');
