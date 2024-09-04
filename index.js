// Get DOM elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDiv = document.getElementById('score');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const squareHeadButton = document.getElementById('squareHead');
const roundHeadButton = document.getElementById('roundHead');

const box = 20; // Size of each snake segment
let score = 0;

// Create the snake
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

// Create the food
let food = generateFood();

// Control the snake
let d;
document.addEventListener('keydown', direction);

let allowInput = true; // Flag to allow keyboard input
let speed = 200; // Initial snake speed in milliseconds
let game;
let headShape = 'square'; // Default head shape

// Handle direction changes
function direction(event) {
    if (!allowInput) return; // If input is not allowed, exit

    allowInput = false; // Temporarily disable input handling

    // Change direction based on arrow keys or WASD
    if ((event.keyCode == 37 || event.keyCode == 65) && d != 'RIGHT') {
        d = 'LEFT';
    } else if ((event.keyCode == 38 || event.keyCode == 87) && d != 'DOWN') {
        d = 'UP';
    } else if ((event.keyCode == 39 || event.keyCode == 68) && d != 'LEFT') {
        d = 'RIGHT';
    } else if ((event.keyCode == 40 || event.keyCode == 83) && d != 'UP') {
        d = 'DOWN';
    }

    setTimeout(() => {
        allowInput = true; // Re-enable input handling after a brief delay
    }, 50); // Adjust this value based on desired movement speed
}

// Draw the entire game
function draw() {
    // Clear the canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
        if (i == 0 && headShape === 'round') {
            // Draw the snake's head as a circle
            ctx.fillStyle = 'green';
            ctx.beginPath();
            ctx.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'red';
            ctx.stroke();
        } else {
            // Draw the snake as rectangles
            ctx.fillStyle = (i == 0) ? 'green' : 'white';
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
            ctx.strokeStyle = 'red';
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }
    }

    // Draw the food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    // Previous head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Move the snake
    if (d == 'LEFT') snakeX -= box;
    if (d == 'UP') snakeY -= box;
    if (d == 'RIGHT') snakeX += box;
    if (d == 'DOWN') snakeY += box;

    // If the snake eats the food
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        scoreDiv.innerText = `Score: ${score}`;
        food = generateFood();
        // Increase speed
        speed = speed > 50 ? speed - 10 : speed; // Adjust decrement and minimum value as needed
        clearInterval(game);
        game = setInterval(draw, speed);
    } else {
        snake.pop();
    }

    // New head
    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // Game over conditions
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        // Show "Game Over" message on the canvas
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        return; // Stop drawing if the game is over
    }

    snake.unshift(newHead);
}

// Generate new food position
function generateFood() {
    let newFood;
    while (true) {
        newFood = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
        // Check if the food appears inside the snake
        if (!collision(newFood, snake)) break;
    }
    return newFood;
}

// Check for collision between an item and an array of positions
function collision(item, array) {
    for (let i = 0; i < array.length; i++) {
        if (item.x == array[i].x && item.y == array[i].y) {
            return true;
        }
    }
    return false;
}

// Start button event listener
startButton.addEventListener('click', () => {
    if (!game) {
        game = setInterval(draw, speed);
    }
});

// Pause button event listener
pauseButton.addEventListener('click', () => {
    clearInterval(game);
    game = null;
});

// Reset button event listener
resetButton.addEventListener('click', () => {
    clearInterval(game);
    game = null;
    snake = [{ x: 9 * box, y: 10 * box }];
    score = 0;
    scoreDiv.innerText = `Score: ${score}`;
    d = undefined;
    food = generateFood();
    speed = 200; // Reset initial speed
    game = setInterval(draw, speed);
});

// Square head button event listener
squareHeadButton.addEventListener('click', () => {
    headShape = 'square';
});

// Round head button event listener
roundHeadButton.addEventListener('click', () => {
    headShape = 'round';
});

// Initialize the game when the window loads
window.onload = function() {
    // Initialize the score display
    scoreDiv.innerText = `Score: ${score}`;
};