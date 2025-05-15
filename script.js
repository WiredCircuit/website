document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header on Scroll ---
    const header = document.querySelector('header');
    const navHeight = header ? header.offsetHeight : 80; // Default nav height if header not found initially

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Smooth Scroll for Nav Links with Offset for Fixed Header ---
    // Selects all <a> tags within elements having class 'nav-links', 'hero', 'cta-section', or 'info-section'
    // that have an href starting with '#'
    const internalLinks = document.querySelectorAll('.nav-links a[href^="#"], .hero a[href^="#"], .cta-section a[href^="#"], .info-section a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Check if it's a pure anchor link on the current page
            if (href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    e.preventDefault(); // Prevent default only if target exists on page
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - navHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // If a burger menu is open, close it after clicking an anchor link
                    const navMenu = document.querySelector('header .nav-links');
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        // If you have a burger icon that changes state, reset it here too
                        const burgerButton = document.getElementById('burger-menu');
                        if (burgerButton) {
                            burgerButton.classList.remove('open'); // Assuming 'open' class for burger state
                        }
                    }
                }
            }
            // For links to other pages (e.g., "kits.html") or links to sections on other pages (e.g., "kits.html#some-id"),
            // the browser will handle the default behavior (navigating to that page/section).
        });
    });


    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // observer.unobserve(entry.target); // Optional: unobserve after first reveal
            } else {
                // entry.target.classList.remove('is-visible'); // Optional: hide again if scrolled out
            }
        });
    }, {
        root: null,
        threshold: 0.1,
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Specific observer for child items for potentially different thresholds or unobserving
    const revealChildItems = document.querySelectorAll('.product-card, .step, .info-section .info-text, .info-section .info-image, .team-member-card, .hero-image');
     const childRevealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // observer.unobserve(entry.target); // Optional
            } else {
                // entry.target.classList.remove('is-visible'); // Optional
            }
        });
    }, {
        root: null,
        threshold: 0.1, // Can be same or different from parent sections
    });

    revealChildItems.forEach(el => {
        childRevealObserver.observe(el);
    });


    // --- Hero Image Parallax/Mouse Move Effect ---
    const heroImagesContainer = document.querySelector('.hero-images');
    if (heroImagesContainer && window.matchMedia("(min-width: 993px)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        heroImagesContainer.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const rect = heroImagesContainer.getBoundingClientRect();
            const x = (clientX - rect.left - rect.width / 2) / 20;
            const y = (clientY - rect.top - rect.height / 2) / 20;

            const heroIndividualImages = heroImagesContainer.querySelectorAll('.hero-image');
            heroIndividualImages.forEach((img, index) => {
                const moveX = x * (1 - index * 0.15);
                const moveY = y * (1 - index * 0.15);
                // Get current transform, remove previous mouse-move translations if any, then add new ones
                let currentTransform = img.style.transform || getComputedStyle(img).transform;
                if (currentTransform === 'none') currentTransform = '';
                // Remove previous translateX/Y applied by this effect
                currentTransform = currentTransform.replace(/translateX\([^)]+\) translateY\([^)]+\)/g, '').trim();
                img.style.transform = `${currentTransform} translateX(${moveX}px) translateY(${moveY}px) translateZ(0px)`;
            });
        });

        heroImagesContainer.addEventListener('mouseleave', () => {
            const heroIndividualImages = heroImagesContainer.querySelectorAll('.hero-image');
            heroIndividualImages.forEach((img) => {
                let currentTransform = img.style.transform || getComputedStyle(img).transform;
                if (currentTransform === 'none') currentTransform = '';
                img.style.transform = currentTransform.replace(/translateX\([^)]+\) translateY\([^)]+\)/g, '').trim();
            });
        });
    }

    // --- Active Nav Link Highlighting ---
    const pageNavLinks = document.querySelectorAll('header .nav-links a');
    const currentPath = window.location.pathname;
    const currentPageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    pageNavLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        // Prevent error if href is null or undefined
        if (!linkHref) return;

        const linkTargetPageName = linkHref.substring(linkHref.lastIndexOf('/') + 1).split("#")[0];

        // Case 1: Current page is index.html (or root like "www.example.com/")
        if (currentPageName === "" || currentPageName === "index.html") {
            // The link must point to "index.html" or be a root path "/" and not contain a hash
            if ((linkTargetPageName === "index.html" || linkTargetPageName === "") && !linkHref.includes("#")) {
                 // More specific check for the "Home" link itself
                if (linkHref === "index.html" || linkHref === "./index.html" || linkHref === "/" || linkHref.endsWith("/index.html")) {
                    link.classList.add('active');
                }
            }
        }
        // Case 2: Current page is another specific page (e.g., about.html, ecommerce.html)
        else if (currentPageName === linkTargetPageName && linkTargetPageName !== "") {
             // Only highlight if it's a direct page link, not a link with a hash to that page from the nav
            if (!linkHref.includes("#")) {
                link.classList.add('active');
            }
        }
    });

    // --- Burger Menu Toggle ---
    // Ensure you have an HTML element with id="burger-menu" for this to work
    // e.g., <button id="burger-menu" aria-label="Open navigation menu"><span></span><span></span><span></span></button>
    const burgerMenuButton = document.getElementById('burger-menu');
    const mainNavMenu = document.querySelector('header .nav-links');

    if (burgerMenuButton && mainNavMenu) {
        burgerMenuButton.addEventListener('click', () => {
            mainNavMenu.classList.toggle('active');
            burgerMenuButton.classList.toggle('open'); // For styling the burger icon itself (e.g., X shape)
            // Optional: Toggle aria-expanded attribute for accessibility
            const isExpanded = mainNavMenu.classList.contains('active');
            burgerMenuButton.setAttribute('aria-expanded', isExpanded);
        });
    }

});