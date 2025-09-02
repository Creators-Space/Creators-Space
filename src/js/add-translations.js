// Integration script to add translation attributes dynamically
// This script can be run in the browser console to add translation attributes to content

document.addEventListener('DOMContentLoaded', function() {
    // Add translation attributes to common elements on the homepage
    const translationMappings = [
        // Course titles and buttons
        { selector: 'h3', text: 'Web Development', attribute: 'homepage.webDevelopment' },
        { selector: 'h3', text: 'UI/UX Design', attribute: 'homepage.uiUxDesign' },
        { selector: 'h3', text: 'Data Science', attribute: 'homepage.dataScience' },
        { selector: 'h3', text: 'Data Analyst', attribute: 'homepage.dataScience' },
        { selector: 'button', text: 'Enroll Now', attribute: 'homepage.enrollNow' },
        
        // Duration texts
        { selector: 'p', text: 'Duration: 6 Months', attribute: 'homepage.duration' },
        { selector: 'p', text: 'Duration: 4 Months', attribute: 'homepage.duration4Months' },
        { selector: 'p', text: 'Duration: 3 Months', attribute: 'homepage.duration3Months' },
        
        // Common buttons and links
        { selector: 'span', text: 'Newsletter', attribute: 'homepage.subscribe' }
    ];

    // Apply translations
    translationMappings.forEach(mapping => {
        const elements = document.querySelectorAll(mapping.selector);
        elements.forEach(element => {
            if (element.textContent.trim() === mapping.text && !element.getAttribute('data-translate')) {
                element.setAttribute('data-translate', mapping.attribute);
            }
        });
    });

    // Special handling for elements that might contain the text partially
    const partialMappings = [
        { selector: 'p', contains: 'Duration:', prefix: 'homepage.duration' }
    ];

    partialMappings.forEach(mapping => {
        const elements = document.querySelectorAll(mapping.selector);
        elements.forEach(element => {
            if (element.textContent.includes(mapping.contains) && !element.getAttribute('data-translate')) {
                if (element.textContent.includes('6 Months')) {
                    element.setAttribute('data-translate', 'homepage.duration');
                } else if (element.textContent.includes('4 Months')) {
                    element.setAttribute('data-translate', 'homepage.duration4Months');
                } else if (element.textContent.includes('3 Months')) {
                    element.setAttribute('data-translate', 'homepage.duration3Months');
                }
            }
        });
    });

    console.log('Translation attributes added successfully!');
});

// Export for manual execution
window.addTranslationAttributesToPage = function() {
    // This can be called manually from browser console
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);
};
