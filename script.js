const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverlay = document.getElementById('game-overlay');

const gridSize = 20;
const gameState = {
  score: 0,
  isGameOver: false,
  isGameStarted: false
};

const snake = {
  x: 200,
  y: 200,
  width: gridSize,
  height: gridSize,
  velocity: gridSize,
  direction: 'right',
  nextDirection: 'right',
  body: [{x: 200, y: 200}]
};

const food = {
  x: 0,
  y: 0,
  color: '#ff6b6b'
};

const colors = {
  snakeHead: '#4ecca3',
  snakeBody: '#45b08c',
  background: '#232931',
  grid: '#2d3436'
};

function drawGrid() {
  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = 0.5;
  
  for (let x = 0; x <= canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  
  for (let y = 0; y <= canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function spawnFood() {
  const availablePositions = [];
  for (let x = 0; x < canvas.width; x += gridSize) {
    for (let y = 0; y < canvas.height; y += gridSize) {
      if (!snake.body.some(segment => segment.x === x && segment.y === y)) {
        availablePositions.push({x, y});
      }
    }
  }
  if (availablePositions.length > 0) {
    const randomPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    food.x = randomPosition.x;
    food.y = randomPosition.y;
  }
}

function draw() {
  // Clear canvas
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid
  drawGrid();

  // Draw food with glow effect
  ctx.shadowColor = food.color;
  ctx.shadowBlur = 15;
  ctx.fillStyle = food.color;
  ctx.beginPath();
  ctx.arc(food.x + gridSize/2, food.y + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Reset shadow
  ctx.shadowBlur = 0;

  // Draw snake
  snake.body.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? colors.snakeHead : colors.snakeBody;
    ctx.beginPath();
    ctx.roundRect(segment.x, segment.y, snake.width - 2, snake.height - 2, 5);
    ctx.fill();
  });

  // Draw "Press Space to Start" if game hasn't started
  if (!gameState.isGameStarted && !gameState.isGameOver) {
    ctx.fillStyle = 'white';
    ctx.font = '20px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('Press Space to Start', canvas.width/2, canvas.height/2);
  }
}

function checkCollision() {
  const head = snake.body[0];
  
  // Wall collision
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    return true;
  }
  
  // Self collision
  for (let i = 1; i < snake.body.length; i++) {
    if (head.x === snake.body[i].x && head.y === snake.body[i].y) {
      return true;
    }
  }
  
  return false;
}

function update() {
  if (gameState.isGameOver || !gameState.isGameStarted) return;

  snake.direction = snake.nextDirection;
  const head = {x: snake.body[0].x, y: snake.body[0].y};

  switch (snake.direction) {
    case 'right':
      head.x += snake.velocity;
      break;
    case 'left':
      head.x -= snake.velocity;
      break;
    case 'up':
      head.y -= snake.velocity;
      break;
    case 'down':
      head.y += snake.velocity;
      break;
  }

  snake.body.unshift(head);

  // Check if snake ate food
  if (head.x === food.x && head.y === food.y) {
    gameState.score += 10;
    scoreElement.textContent = gameState.score;
    spawnFood();
  } else {
    snake.body.pop();
  }

  if (checkCollision()) {
    gameState.isGameOver = true;
    gameOverlay.style.display = 'flex';
  }
}

function keyHandler(e) {
  if (e.code === 'Space') {
    if (!gameState.isGameStarted) {
      gameState.isGameStarted = true;
      return;
    }
    if (gameState.isGameOver) {
      resetGame();
      return;
    }
  }

  if (!gameState.isGameStarted || gameState.isGameOver) return;

  const oppositeDirections = {
    'right': 'left',
    'left': 'right',
    'up': 'down',
    'down': 'up'
  };

  switch (e.key) {
    case 'ArrowRight':
      if (snake.direction !== oppositeDirections['right']) {
        snake.nextDirection = 'right';
      }
      break;
    case 'ArrowLeft':
      if (snake.direction !== oppositeDirections['left']) {
        snake.nextDirection = 'left';
      }
      break;
    case 'ArrowUp':
      if (snake.direction !== oppositeDirections['up']) {
        snake.nextDirection = 'up';
      }
      break;
    case 'ArrowDown':
      if (snake.direction !== oppositeDirections['down']) {
        snake.nextDirection = 'down';
      }
      break;
  }
}

function resetGame() {
  snake.x = 200;
  snake.y = 200;
  snake.direction = 'right';
  snake.nextDirection = 'right';
  snake.body = [{x: 200, y: 200}];
  gameState.score = 0;
  gameState.isGameOver = false;
  gameState.isGameStarted = false;
  scoreElement.textContent = '0';
  gameOverlay.style.display = 'none';
  spawnFood();
}

// Initial setup
resetGame();
setInterval(function() {
  update();
  draw();
}, 100);

document.addEventListener('keydown', keyHandler);