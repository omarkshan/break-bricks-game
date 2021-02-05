const grid = document.querySelector(".grid");
const gridWidth = document.querySelector(".grid").clientWidth;
const gridHeight = document.querySelector(".grid").clientHeight;

let isGameStart = false;
let isPassed = false;

let score = 0;
const scoreDisplay = document.querySelector("#score");
const reloadDisplay = document.querySelector("#reload");
scoreDisplay.innerHTML = score;

let levelMultiplier = 1;
let displayLevel = document.querySelector("#level");
let currentLevel = Number.parseInt(displayLevel.innerHTML);
const blocksPerLvl = 1;
let userSpeed = 20;

let timerId;

console.log(gridWidth);
console.log(gridHeight);
const blockWidth = 100;
const blockHeight = 20;

// Creates Block
class Block {
  constructor(_xAxis, _yAxis) {
    this.bottomLeft = [_xAxis, _yAxis];
    this.bottomRight = [_xAxis + blockWidth, _yAxis];
    this.topLeft = [_xAxis, _yAxis + blockHeight];
    this.topRight = [_xAxis + blockWidth, _yAxis + blockHeight];
  }
}

// All Blocks
let blocks = [];

function populateBlocks() {
  let rowCount = 0;
  let widthTracker = 10;
  let heightTracker = gridHeight - 30;
  for (let i = 0; i < levelMultiplier * blocksPerLvl; i++) {
    blocks.push(new Block(widthTracker, heightTracker));
    console.log("Block Added");
    if (widthTracker + blockWidth + 50 < gridWidth) {
      widthTracker += 110;
    } else {
      rowCount++;
      if (rowCount % 2 == 0) widthTracker = 10;
      if (rowCount % 2 == 1) widthTracker = 20;
      heightTracker -= 30;
    }
  }
  console.log(blocks);
  console.log(`Current Level: ${currentLevel}`);
}

// Draws all blocks
function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = blocks[i].bottomLeft[0] + "px";
    block.style.bottom = blocks[i].bottomLeft[1] + "px";
    grid.appendChild(block);
  }
}

populateBlocks();
addBlocks();

// Draws object
function drawObject(object, currentPos) {
  object.style.left = currentPos[0] + "px";
  object.style.bottom = currentPos[1] + "px";
}

/// User

const user = document.createElement("div");
user.classList.add("user");
grid.appendChild(user);

const userWidth = document.querySelector(".user").clientWidth;
const userHeight = document.querySelector(".user").clientHeight;

const userStart = [gridHeight - 70, 10];
let userCurrentPosition = userStart;

drawObject(user, userCurrentPosition);

function game(e) {
  switch (e.keyCode) {
    case 32:
      isGameStart = !isGameStart;
      if (isGameStart) {
        document.addEventListener("keydown", moveUser);
        timerId = setInterval(moveBall, 10);
        console.log("Game Started");
      } else {
        clearInterval(timerId);
        document.removeEventListener("keydown", moveUser);
        console.log("Game Paused");
      }
      break;
    case 13:
      if (isPassed) {
        currentLevel += 1;
        displayLevel.innerHTML = currentLevel;
        levelMultiplier = currentLevel;
        populateBlocks();
        addBlocks();
        drawObject(ball, ballStart);
        drawObject(user, userStart);
        document.addEventListener("keydown", moveUser);
        timerId = setInterval(moveBall, 10);
        isPassed = false;
      }
      break;

    default:
      break;
  }
}

// User movement
function moveUser(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (userCurrentPosition[0] > 5) {
        userCurrentPosition[0] -= userSpeed;
        drawObject(user, userCurrentPosition);
      }
      break;
    case "ArrowRight":
      if (userCurrentPosition[0] < gridWidth - (userWidth + 5)) {
        userCurrentPosition[0] += userSpeed;
        drawObject(user, userCurrentPosition);
      }
    default:
      break;
  }
}

document.addEventListener("keydown", moveUser);
document.addEventListener("keydown", game);

/// Ball
const ballStart = [gridWidth / 2, gridHeight / 10];
let ballCurrentPosition = ballStart;

const ball = document.createElement("div");
ball.classList.add("ball");
ball.style.left = ballCurrentPosition[0] + "px";
ball.style.bottom = ballCurrentPosition[1] + "px";
grid.appendChild(ball);

const ballDiameter = ball.offsetWidth;
console.log(ballDiameter);
let _xBall = -2;
let _yBall = 2;

drawObject(ball, ballCurrentPosition);

// Ball movement
function moveBall() {
  ballCurrentPosition[0] += _xBall;
  ballCurrentPosition[1] += _yBall;
  drawObject(ball, ballCurrentPosition);
  onGridCollide();
  onBlockCollide();
  onUserCollide();
  isGameOver();
  isWin();
}

timerId = setInterval(moveBall, 10);

// Check for Block Collisions
function onBlockCollide() {
  let isBetweenBlock;
  let yBlock;
  for (let i = 0; i < blocks.length; i++) {
    isBetweenBlock =
      ballCurrentPosition[0] > blocks[i].bottomLeft[0] &&
      ballCurrentPosition[0] < blocks[i].bottomRight[0];
    yBlock =
      ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      ballCurrentPosition[1] < blocks[i].topLeft[1];

    if (isBetweenBlock && yBlock) {
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      allBlocks[i].classList.remove("block");
      blocks.splice(i, 1);
      changeDirection();
      score++;
      scoreDisplay.innerHTML = score;
    }
  }
}

// Check for User Collisions
function onUserCollide() {
  let widthCondition =
    ballCurrentPosition[0] > userCurrentPosition[0] &&
    ballCurrentPosition[0] < userCurrentPosition[0] + userWidth;
  let heightCondition =
    ballCurrentPosition[1] > userCurrentPosition[1] &&
    ballCurrentPosition[1] < userCurrentPosition[1] + userHeight;

  if (widthCondition && heightCondition) {
    changeDirection();
  }
}

// Check for Grid Collisions
function onGridCollide() {
  // Collide conditions
  let xRightCollide = ballCurrentPosition[0] >= gridWidth - ballDiameter;
  let yTopCollide = ballCurrentPosition[1] >= gridHeight - ballDiameter;
  let xLeftCollide = ballCurrentPosition[0] <= 0;

  // Check wall collisions
  if (xRightCollide || yTopCollide || xLeftCollide) {
    changeDirection();
  }
}

function isWin() {
  // Check if Won
  if (blocks.length === 0) {
    scoreDisplay.innerHTML = "You Won \\OoO/";
    clearInterval(timerId);
    document.removeEventListener("keydown", moveUser);
    isPassed = true;
  }
}

function isGameOver() {
  let yBottomCollide = ballCurrentPosition[1] <= 0;

  // Check if Game Over
  if (yBottomCollide) {
    clearInterval(timerId);
    user.style.transform = "rotate(45deg)";
    user.style.transition = "all 0.5s";
    document.removeEventListener("keydown", moveUser);
    reloadDisplay.innerHTML =
      "Oops.. You Lose X_X<br>RELOAD THE PAGE TO RESTART THE GAME..";
    grid.style.borderBottomStyle = "dashed";
  }
}

function changeDirection() {
  if (_xBall === 2 && _yBall === 2) {
    _yBall = -2;
    return;
  }
  if (_xBall === 2 && _yBall === -2) {
    _xBall = -2;
    return;
  }
  if (_xBall === -2 && _yBall === -2) {
    _yBall = 2;
    return;
  }
  if (_xBall === -2 && _yBall === 2) {
    _xBall = 2;
    return;
  }
}

function resetGame() {
  document.addEventListener("keydown", moveUser);
  timerId = setInterval(moveBall, 10);
}
