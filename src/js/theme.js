document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('themeToggle') || document.querySelector('.toggle-switch input');
    const body = document.body;
    const navbarLogo = document.getElementById('navbar-logo');

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark');
            if (navbarLogo) navbarLogo.src = './assets/images/logo-nav-dark.png';
            if (themeToggleButton && themeToggleButton.type === 'checkbox') themeToggleButton.checked = true;
        } else {
            body.classList.remove('dark');
            if (navbarLogo) navbarLogo.src = './assets/images/logo-nav-light.png';
            if (themeToggleButton && themeToggleButton.type === 'checkbox') themeToggleButton.checked = false;
        }
    };

    const toggleTheme = () => {
        const isDarkMode = body.classList.toggle('dark');
        const newTheme = isDarkMode ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    };

    // Add event listener to the toggle button
    if (themeToggleButton) {
        if (themeToggleButton.type === 'checkbox') {
            themeToggleButton.addEventListener('change', toggleTheme);
        } else {
            themeToggleButton.addEventListener('click', toggleTheme);
        }
    }

    // Apply saved theme on initial load
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDark) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }
});