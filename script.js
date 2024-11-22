
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 5;
let score = 0;
let last = 0;
let gamePaused = true; // Start paused
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 12, y: 17 };


const board = document.getElementById('board');
const scoreBox = document.getElementById('scoreBox');
const highScoreBox = document.getElementById('hiscoreBox');
const playButton = document.getElementById('playButton');

let highScore = localStorage.getItem("highScore") || 0;
highScoreBox.innerHTML = `Your Best: ${highScore}`;

// Main function
function main(ctime) {
    if (gamePaused) return;
    window.requestAnimationFrame(main);
    if ((ctime - last) / 1000 < 1 / speed) return;
    last = ctime;
    gameEngine();
}

//  main logic 
function gameEngine() {
    // jab snake takra jaye 
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        gamePaused = true;
        inputDir = { x: 0, y: 0 };
        playButton.style.display = "block";
        board.classList.add("blur");
        return;
    }

    // jab khana mile 
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score += 1;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            highScoreBox.innerHTML = `Your Best: ${highScore}`;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        food = { x: Math.round(2 + 14 * Math.random()), y: Math.round(2 + 14 * Math.random()) };
        if (snakeArr.length % 4 === 0) speed += 2;
    }
    

    // up,down ->,<-
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(snakeElement);
    });

    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// diwar m mil jaye
function isCollide(snake) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    if (snake[0].x < 0 || snake[0].x >= 18 || snake[0].y < 0 || snake[0].y >= 18) return true;
    return false;
}

// button
playButton.addEventListener('click', () => {
    playButton.style.display = "none"; // Hide Play Button
    board.classList.remove("blur"); // Remove Blur Effect
    snakeArr = [{ x: 13, y: 15 }];
    food = { x: 12, y: 17 };
    score = 0;
    speed = 5;
    scoreBox.innerHTML = "Score: 0";
    gamePaused = false;
    musicSound.play();
    window.requestAnimationFrame(main);
});

//  Controls
window.addEventListener('keydown', (e) => {
    if (gamePaused) return; 
    inputDir = { x: 0, y: 1 }; 
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            console.log("ArrowUp");
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            console.log("ArrowDown");
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowLeft":
            console.log("ArrowLeft");
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case "ArrowRight":
            console.log("ArrowRight");
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
});

// Start the Game (Initial Blur)
board.classList.add("blur");
