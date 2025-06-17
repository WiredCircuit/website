document.addEventListener('DOMContentLoaded', () => {
    // Select DOM elements
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mainContent = document.querySelector('.main-content');
    const backToTopButton = document.getElementById('back-to-top');
    const themeToggleButton = document.getElementById('theme-toggle');
    const body = document.body;

    const LARGE_SCREEN_WIDTH = 992; // Breakpoint for sidebar behavior

    // --- Theme Switcher ---
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    let currentTheme = localStorage.getItem('theme'); // Check local storage first

    function applyTheme(theme) {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggleButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`);
        // Re-highlight after theme change might be needed if styles drastically change Prism token colors
        if (window.Prism) {
            setTimeout(() => {
                Prism.highlightAll();
            }, 50); // Small delay to allow CSS to apply
        }
    }

    // Set initial theme
    if (!currentTheme) {
        currentTheme = prefersDark.matches ? 'dark' : 'light';
    }
    applyTheme(currentTheme);

    // Theme toggle button event
    themeToggleButton.addEventListener('click', () => {
        const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    // Listen for system theme changes if no preference is stored
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const systemTheme = e.matches ? 'dark' : 'light';
            applyTheme(systemTheme);
        }
    });

    // --- Sidebar Toggle ---
    function handleSidebarToggle() {
         if (window.innerWidth < LARGE_SCREEN_WIDTH) {
            sidebar.classList.toggle('active'); // Mobile toggle
        } else {
            sidebar.classList.toggle('collapsed'); // Desktop toggle
            mainContent.classList.toggle('collapsed');
        }
    }
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', handleSidebarToggle);
    }

    // Adjust sidebar state on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= LARGE_SCREEN_WIDTH) {
            // On large screens, remove 'active' class (used for mobile overlay)
            sidebar.classList.remove('active');
            // Ensure 'collapsed' state matches main content state
            if (!mainContent.classList.contains('collapsed')) {
                 sidebar.classList.remove('collapsed');
            } else {
                 sidebar.classList.add('collapsed');
            }
        } else {
            // On small screens, remove desktop 'collapsed' classes
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('collapsed');
            // Sidebar will be hidden by default CSS transform unless 'active' is added
        }
    });
    // Initial check on load for smaller screens
    if (window.innerWidth < LARGE_SCREEN_WIDTH) {
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('collapsed');
    } else if (mainContent.classList.contains('collapsed')) {
        // Ensure sidebar starts collapsed if main content is
        sidebar.classList.add('collapsed');
    }


    // --- Tabs Functionality ---
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabContainer = tab.closest('.tabs');
            const contentContainer = tab.closest('.section');
            if (!tabContainer || !contentContainer) return;

            // Deactivate other tabs and content in the same section
            tabContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            contentContainer.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            // Activate clicked tab and corresponding content
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            const targetContent = contentContainer.querySelector('#' + tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // --- Back to Top Button ---
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            // Show button if scrolled down more than 300px
            backToTopButton.classList.toggle('visible', window.pageYOffset > 300);
        });
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor behavior
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top
        });
    }

    // --- Highlight Active Section in Sidebar (Scrollspy) ---
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');
    const headerHeight = document.querySelector('.main-header')?.offsetHeight || 80; // Get header height for offset

    function updateActiveNav() {
        let currentSectionId = '';
        const scrollPosition = window.pageYOffset;

        sections.forEach(section => {
            // Calculate section top considering header height and a small buffer
            const sectionTop = section.offsetTop - headerHeight - 20;
            if (scrollPosition >= sectionTop) { // Check if scroll position is past the section top
                currentSectionId = section.getAttribute('id');
            }
        });

        // Handle edge case: if scrolled near the bottom, activate the last section
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 50 && sections.length > 0) {
           currentSectionId = sections[sections.length - 1].getAttribute('id');
        }

        let foundActive = false;
        navLinks.forEach(link => {
            link.classList.remove('active'); // Remove active class from all links first
            const href = link.getAttribute('href');
            // Check if link's href matches the current section ID
            if (href === `#${currentSectionId}`) {
                link.classList.add('active');
                foundActive = true;
            }
        });

        // Default to intro section if no other section is active (e.g., at the very top)
        if (!foundActive && navLinks.length > 0 && scrollPosition < sections[0].offsetTop - headerHeight - 20 ) {
            const introLink = document.querySelector('.sidebar-nav a[href="#intro"]');
            if (introLink) introLink.classList.add('active');
        }
    }

    // Add scroll listener for scrollspy if sections and links exist
    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', updateActiveNav, { passive: true }); // Use passive listener for performance
        updateActiveNav(); // Run once on load to set initial state
    }

    // --- Animate Sections on Scroll (Intersection Observer) ---
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view'); // Add class when section enters viewport
                // Optional: unobserve after animation to save resources
                // observer.unobserve(entry.target);
            }
            // Optional: remove class if section scrolls out of view (for re-animation)
            // else {
            //     entry.target.classList.remove('in-view');
            // }
        });
    }, {
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before section is fully visible
        threshold: 0.1 // Trigger when 10% of the section is visible
    });

    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        sectionObserver.observe(section);
    });

    // --- Initialize Prism Plugins ---
    // MODIFIED: Customize the copy-to-clipboard button to use an icon
    if (window.Prism && Prism.plugins && Prism.plugins.toolbar) {
         Prism.plugins.toolbar.registerButton('copy-to-clipboard', function (env) {
            var button = document.createElement('button');

            // --- Use Font Awesome icon instead of text ---
            button.innerHTML = '<i class="fas fa-copy" aria-hidden="true"></i>';

            // Add accessibility features
            button.setAttribute('aria-label', 'Copy code to clipboard');
            button.setAttribute('title', 'Copy code to clipboard'); // Tooltip on hover

            // The copy-to-clipboard plugin script (loaded via CDN)
            // automatically adds the click handler to this button
            // if it finds the 'copy-to-clipboard' class or relies on this registration key.

            return button;
         });
    }

}); // End DOMContentLoaded