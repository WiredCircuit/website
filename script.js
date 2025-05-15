// script.js
document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header on Scroll ---
    const header = document.querySelector('header');
    const navHeight = header.offsetHeight; // Get nav height for scroll calculations

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // A small threshold
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Smooth Scroll for Nav Links with Offset for Fixed Header ---
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .hero a[href^="#"], .cta-section a[href^="#"], .info-section a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Only prevent default for internal links (starting with #) on the same page
            if (href.startsWith('#') && document.getElementById(href.substring(1))) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Use the dynamically fetched navHeight
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - navHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
            // For links to other pages (like kits.html#some-id), let the browser handle default behavior
            // For links like kits.html, also default behavior
        });
    });


    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // If children items need staggered animation, their parent gets 'is-visible'
                // and CSS :nth-child with animation-delay handles the stagger.
                 if (entry.target.classList.contains('products-grid') || entry.target.classList.contains('steps-container')) {
                    // This is mostly for the parent grid/container itself.
                    // Individual cards/steps are handled by the more general rule below
                    // or specific CSS if the parent has .is-visible.
                }
                // observer.unobserve(entry.target); // Optional: unobserve after first reveal
            } else {
                // Optional: Hide again if scrolled out of view.
                // Be careful with this, can be jarring.
                // entry.target.classList.remove('is-visible');
            }
        });
    }, {
        root: null,
        threshold: 0.1, // 10% of item visible for section reveals
        // rootMargin: "-50px" 
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Specific observer for product cards and steps for finer control if needed,
    // though the CSS stagger with parent.is-visible should mostly cover it.
    const revealChildItems = document.querySelectorAll('.product-card, .step, .info-section .info-text, .info-section .info-image');
     const childRevealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible'); // This class is what triggers their individual animation
                // observer.unobserve(entry.target);
            } else {
                // entry.target.classList.remove('is-visible');
            }
        });
    }, {
        root: null,
        threshold: 0.15, // Trigger a bit later for individual items
    });

    revealChildItems.forEach(el => {
        childRevealObserver.observe(el);
    });


    // --- Hero Image Parallax/Mouse Move Effect (Subtle) ---
    // This was removed in the thought process as it could interfere with other transforms,
    // but if you want a simple version for the container:
    const heroImagesContainer = document.querySelector('.hero-images');
    if (heroImagesContainer && window.matchMedia("(min-width: 993px)").matches) { // Only on larger screens
        heroImagesContainer.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const rect = heroImagesContainer.getBoundingClientRect();
            const x = (clientX - rect.left - rect.width / 2) / 20; // Movement factor
            const y = (clientY - rect.top - rect.height / 2) / 20;

            // Apply to individual images with slight variation
            const heroIndividualImages = heroImagesContainer.querySelectorAll('.hero-image');
            heroIndividualImages.forEach((img, index) => {
                const moveX = x * (1 - index * 0.15); // Vary effect per image
                const moveY = y * (1 - index * 0.15);
                // Preserve existing animated transforms
                const existingTransform = img.style.transform.replace(/translateZ\(0px\)/g, '').trim(); // Clean up if needed
                img.style.transform = `${existingTransform} translateX(${moveX}px) translateY(${moveY}px) translateZ(0px)`; // Added translateZ for performance
            });
        });

        heroImagesContainer.addEventListener('mouseleave', () => {
            const heroIndividualImages = heroImagesContainer.querySelectorAll('.hero-image');
            heroIndividualImages.forEach((img) => {
                // Reset only the mouse-move part of transform, keep animation part
                img.style.transform = img.style.transform.replace(/translateX\([^)]+\) translateY\([^)]+\)/g, '').trim();
            });
        });
    }

    // --- Active Nav Link Highlighting based on current page ---
    // (for kits.html, the 'Kits' link should be active)
    const currentPage = window.location.pathname.split("/").pop(); // e.g., "index.html" or "kits.html"
    const navHeaderLinks = document.querySelectorAll('header .nav-links a');

    navHeaderLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split("/").pop().split("#")[0]; // Get page name from href
        if (linkPage === currentPage || (currentPage === "" && linkPage === "index.html")) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // If you implement a burger menu, add JS for toggling '.nav-links.active' here.
    // Example (requires a burger menu button with id="burger-menu"):
    /*
    const burgerMenu = document.getElementById('burger-menu'); // You'd need to add this button to HTML
    const navMenu = document.querySelector('header .nav-links');
    if (burgerMenu && navMenu) {
        burgerMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    */

});