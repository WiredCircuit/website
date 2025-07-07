document.addEventListener('DOMContentLoaded', () => {

    // --- ALL OF YOUR EXISTING JS CODE GOES HERE ---
    // (Sticky Header, Smooth Scroll, Animations, etc.)

    // ... (keep all your existing code) ...

    // --- START: NEW CODE FOR CONTACT MODAL ---
    // Place this code at the end, but before the final closing });
    
    const contactButtons = document.querySelectorAll('.contact-to-buy-btn');
    const modal = document.getElementById('contact-modal');

    // Only run if the modal and buttons exist on the page
    if (modal && contactButtons.length > 0) {
        const closeModalBtn = document.querySelector('.modal-close');
        const modalProductName = document.getElementById('modal-product-name');
        const whatsappLink = document.getElementById('whatsapp-link');
        const messengerLink = document.getElementById('messenger-link');
        const instagramLink = document.getElementById('instagram-link');

        // --- START: USER CONFIGURATION ---
        // Please replace placeholders with your actual details if they are different.
        const WHATSAPP_NUMBER = '9767398519'; // Use country code, no '+' or '00'
        const MESSENGER_USERNAME = 'wiredcircuit'; // Your Facebook Page username
        const INSTAGRAM_USERNAME = 'wiredcircuit'; // Your Instagram username
        // --- END: USER CONFIGURATION ---

        contactButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();

                // Find the product title within the same card
                const productCard = button.closest('.product-card');
                const productTitle = productCard.querySelector('.product-title').textContent.trim();

                // Update the modal with the product name
                modalProductName.textContent = productTitle;

                // Generate the message and encode it for the URL
                const message = `Hello, I'm interested in buying the "${productTitle}".`;
                const encodedMessage = encodeURIComponent(message);

                // Update the links in the modal
                whatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
                messengerLink.href = `https://m.me/${MESSENGER_USERNAME}?text=${encodedMessage}`;
                // Instagram does not support pre-filled messages via URL
                instagramLink.href = `https://ig.me/m/${INSTAGRAM_USERNAME}`;

                // Show the modal
                modal.classList.add('active');
            });
        });

        // Function to close the modal
        const closeModal = () => {
            modal.classList.remove('active');
        };

        // Close modal when the close button is clicked
        closeModalBtn.addEventListener('click', closeModal);

        // Close modal when the overlay (background) is clicked
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close modal with the Escape key for better accessibility
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
    // --- END: NEW CODE FOR CONTACT MODAL ---

}); // This is the closing bracket for your DOMContentLoaded listener.