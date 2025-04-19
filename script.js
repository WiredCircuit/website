
// Scroll Animation for How It Works Steps
document.addEventListener('DOMContentLoaded', function () {
    const steps = document.querySelectorAll('.step');

    function checkScroll() {
        steps.forEach(step => {
            const position = step.getBoundingClientRect();

            // If element is in viewport
            if (position.top < window.innerHeight - 100) {
                step.classList.add('visible');
            }
        });
    }

    // Check positions initially
    checkScroll();

    // Check positions on scroll
    window.addEventListener('scroll', checkScroll);

    // Mini Game Logic
    const car = document.getElementById('car');
    const gameRoad = document.getElementById('gameRoad');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    const startBtn = document.getElementById('startBtn');
    const scoreDisplay = document.getElementById('score');

    let carPosition = 50; // percentage from left
    let gameRunning = false;
    let obstacles = [];
    let animationId;
    let score = 0;

    // Car movement
    function moveCar(direction) {
        if (direction === 'left' && carPosition > 10) {
            carPosition -= 5;
        } else if (direction === 'right' && carPosition < 90) {
            carPosition += 5;
        }
        car.style.left = carPosition + '%';
    }

    // Event listeners for buttons
    leftBtn.addEventListener('click', () => moveCar('left'));
    rightBtn.addEventListener('click', () => moveCar('right'));

    // Event listeners for keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            moveCar('left');
        } else if (e.key === 'ArrowRight') {
            moveCar('right');
        }
    });

    // Create obstacles
    function createObstacle() {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        const randomPosition = Math.floor(Math.random() * 80) + 10; // 10-90%
        obstacle.style.left = randomPosition + '%';
        gameRoad.appendChild(obstacle);
        obstacles.push({
            element: obstacle,
            position: randomPosition
        });
    }

    // Move obstacles
    function moveObstacles() {
        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i];
            const obstacleTop = parseInt(window.getComputedStyle(obstacle.element).getPropertyValue('top'));

            // Move obstacle down
            obstacle.element.style.top = obstacleTop + 3 + 'px';

            // Check if obstacle is out of screen
            if (obstacleTop > gameRoad.offsetHeight) {
                obstacle.element.remove();
                obstacles.splice(i, 1);
                i--;
                score++;
                scoreDisplay.textContent = 'Score: ' + score;
            }

            // Check collision
            if (isCollision(car, obstacle.element)) {
                endGame();
            }
        }
    }

    // Check collision
    function isCollision(car, obstacle) {
        const carRect = car.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        return !(
            carRect.bottom < obstacleRect.top ||
            carRect.top > obstacleRect.bottom ||
            carRect.right < obstacleRect.left ||
            carRect.left > obstacleRect.right
        );
    }

    // Game loop
    function gameLoop() {
        moveObstacles();

        // Create new obstacle randomly
        if (gameRunning && Math.random() < 0.02) {
            createObstacle();
        }

        if (gameRunning) {
            animationId = requestAnimationFrame(gameLoop);
        }
    }

    // Start game
    startBtn.addEventListener('click', () => {
        if (gameRunning) {
            endGame();
        } else {
            startGame();
        }
    });

    function startGame() {
        gameRunning = true;
        score = 0;
        scoreDisplay.textContent = 'Score: ' + score;
        carPosition = 50;
        car.style.left = carPosition + '%';

        // Clear existing obstacles
        obstacles.forEach(obstacle => obstacle.element.remove());
        obstacles = [];

        startBtn.textContent = 'Stop Game';
        animationId = requestAnimationFrame(gameLoop);
    }

    function endGame() {
        gameRunning = false;
        cancelAnimationFrame(animationId);
        startBtn.textContent = 'Start Game';
        alert('Game Over! Your score: ' + score);
    }

    // Create lane markers
    function createLaneMarkers() {
        for (let i = 0; i < 6; i++) {
            const marker = document.createElement('div');
            marker.classList.add('lane-marker');
            marker.style.top = (i * 60) - 60 + 'px';
            gameRoad.appendChild(marker);

            // Animate lane markers
            animateLaneMarker(marker);
        }
    }

    function animateLaneMarker(marker) {
        let position = parseInt(marker.style.top);

        function move() {
            position += 2;
            if (position > gameRoad.offsetHeight) {
                position = -50;
            }
            marker.style.top = position + 'px';
            if (gameRunning) {
                requestAnimationFrame(move);
            }
        }

        requestAnimationFrame(move);
    }

    createLaneMarkers();
});