// --- Remove Old Circuit Logic ---
// (All variables and functions related to switches and bulb are gone)

// --- Mini Game Logic --- NEW ---
const car = document.getElementById('car');
const track = document.getElementById('track');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

let carPosPercent = 50; // Position as percentage of track width (start at 50%)
const moveStepPercent = 5; // Move 5% of the track width per click

function moveCar(direction) {
    // Calculate track boundaries
    // We use percentages to make it responsive to track width changes
    const trackWidth = track.offsetWidth;
    // The car's visual width is tricky with emoji, approximate or use a fixed width div
    // For simplicity, let's set boundaries slightly inset from the edges (e.g., 5% margin)
    const minPercent = 5; // Minimum left percentage
    const maxPercent = 95; // Maximum left percentage

    if (direction === 'left') {
        carPosPercent -= moveStepPercent;
    } else if (direction === 'right') {
        carPosPercent += moveStepPercent;
    }

    // Clamp position within boundaries
    carPosPercent = Math.max(minPercent, Math.min(maxPercent, carPosPercent));

    // Apply the transform using percentage
    // translateX(-50%) keeps the *center* of the car at carPosPercent
    car.style.left = `${carPosPercent}%`;
}

// Add event listeners for buttons
leftButton.addEventListener('click', () => moveCar('left'));
rightButton.addEventListener('click', () => moveCar('right'));

// Optional: Add keyboard controls for the game
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        moveCar('left');
        leftButton.focus(); // Optional: give visual feedback
        leftButton.click(); // Trigger active state style
    } else if (event.key === 'ArrowRight') {
        moveCar('right');
        rightButton.focus(); // Optional: give visual feedback
        rightButton.click(); // Trigger active state style
    }
});


// --- Scroll Animation Logic (Keep As Is) ---
const animatedElements = document.querySelectorAll('.animate-on-scroll');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // observer.unobserve(entry.target); // Uncomment if you want animation only once
        }
        // else { // Uncomment if you want elements to fade out when scrolling up
        //     entry.target.classList.remove('is-visible');
        // }
    });
}, {
    root: null,
    threshold: 0.1 // Adjust threshold if needed (0.1 means 10% visible)
});

animatedElements.forEach(el => {
    observer.observe(el);
});