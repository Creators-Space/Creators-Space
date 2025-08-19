// Newsletter Popup Functionality
class NewsletterPopup {
    constructor() {
        this.popup = document.getElementById('newsletter-popup');
        this.triggerButton = document.getElementById('newsletter-trigger');
        this.closeButton = document.querySelector('.newsletter-close');
        this.form = document.getElementById('newsletter-form');
        this.emailInput = document.getElementById('newsletter-email');
        this.messageArea = document.getElementById('newsletter-message');
        
        this.init();
    }

    init() {
        // Check if user has already subscribed or dismissed
        this.checkUserPreference();
        
        // Auto-show popup after delay (if not dismissed before)
        this.autoShowPopup();
        
        // Add event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        // Close popup when clicking outside
        this.popup.addEventListener('click', (e) => {
            if (e.target === this.popup) {
                this.closePopup();
            }
        });

        // Close popup with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.popup.classList.contains('show')) {
                this.closePopup();
            }
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    checkUserPreference() {
        const hasSubscribed = localStorage.getItem('newsletter_subscribed');
        const hasDismissed = localStorage.getItem('newsletter_dismissed');
        
        // Debug logging
        console.log('Newsletter: User preferences - Subscribed:', hasSubscribed, 'Dismissed:', hasDismissed);
        
        if (hasSubscribed || hasDismissed) {
            // Hide trigger button if already subscribed
            if (hasSubscribed) {
                this.triggerButton.style.display = 'none';
                console.log('Newsletter: User already subscribed, hiding trigger button');
            }
            if (hasDismissed) {
                console.log('Newsletter: User dismissed popup, not showing automatically');
            }
        }
    }

    autoShowPopup() {
        // Show popup after 3 seconds if user hasn't interacted before
        const hasSubscribed = localStorage.getItem('newsletter_subscribed');
        const hasDismissed = localStorage.getItem('newsletter_dismissed');
        const hasInteracted = hasSubscribed || hasDismissed;
        
        console.log('Newsletter: Auto-show check - Has interacted:', hasInteracted);
        
        if (!hasInteracted) {
            console.log('Newsletter: First-time visitor, will show popup in 3 seconds');
            setTimeout(() => {
                this.showPopup();
            }, 3000);
        } else {
            console.log('Newsletter: Returning visitor, not showing popup automatically');
        }
    }

    showPopup() {
        this.popup.classList.add('show');
        this.emailInput.focus();
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        console.log('Newsletter: Popup shown');
    }

    closePopup() {
        this.popup.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Mark as dismissed if not subscribed
        if (!localStorage.getItem('newsletter_subscribed')) {
            localStorage.setItem('newsletter_dismissed', 'true');
            console.log('Newsletter: Popup dismissed, marked in localStorage');
        }
        
        // Clear form
        this.clearForm();
        console.log('Newsletter: Popup closed');
    }

    clearForm() {
        this.form.reset();
        this.messageArea.textContent = '';
        this.messageArea.className = 'newsletter-message';
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async handleSubmit() {
        const email = this.emailInput.value.trim();
        
        // Clear previous messages
        this.messageArea.textContent = '';
        this.messageArea.className = 'newsletter-message';

        // Validate email
        if (!email) {
            this.showMessage('Please enter your email address.', 'error');
            return;
        }

        if (!this.validateEmail(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = this.form.querySelector('.subscribe-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Subscribing...</span>';
        submitBtn.disabled = true;

        try {
            // Simulate API call (replace with actual email service later)
            await this.simulateSubscription(email);
            
            // Success
            this.showMessage('Thank you for subscribing! You\'ll receive updates soon.', 'success');
            localStorage.setItem('newsletter_subscribed', email);
            localStorage.removeItem('newsletter_dismissed');
            
            // Hide trigger button
            this.triggerButton.style.display = 'none';
            
            // Close popup after 2 seconds
            setTimeout(() => {
                this.closePopup();
            }, 2000);
            
        } catch (error) {
            this.showMessage('Something went wrong. Please try again.', 'error');
        } finally {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async simulateSubscription(email) {
        // Simulate network delay
        return new Promise((resolve) => {
            setTimeout(() => {
                // Store email in localStorage for now
                const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
                }
                resolve();
            }, 1000);
        });
    }

    showMessage(message, type) {
        this.messageArea.textContent = message;
        this.messageArea.className = `newsletter-message ${type}`;
        
        // Auto-hide error messages after 5 seconds
        if (type === 'error') {
            setTimeout(() => {
                if (this.messageArea.textContent === message) {
                    this.messageArea.textContent = '';
                    this.messageArea.className = 'newsletter-message';
                }
            }, 5000);
        }
    }
}

// Global functions for HTML onclick handlers
function showNewsletterPopup() {
    if (window.newsletterPopup) {
        window.newsletterPopup.showPopup();
    }
}

function closeNewsletterPopup() {
    if (window.newsletterPopup) {
        window.newsletterPopup.closePopup();
    }
}

function handleNewsletterSubmit(event) {
    if (window.newsletterPopup) {
        window.newsletterPopup.handleSubmit();
    }
}

// Utility function to clear newsletter localStorage (for testing)
function clearNewsletterStorage() {
    localStorage.removeItem('newsletter_subscribed');
    localStorage.removeItem('newsletter_dismissed');
    localStorage.removeItem('newsletter_subscribers');
    console.log('Newsletter: All localStorage cleared for testing');
    
    // Reload page to reset state
    if (confirm('Newsletter storage cleared! Reload page to test again?')) {
        location.reload();
    }
}

// Initialize newsletter popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.newsletterPopup = new NewsletterPopup();
});

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NewsletterPopup;
}
