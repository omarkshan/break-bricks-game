const grid = document.querySelector(".grid");
const gridWidth = document.querySelector(".grid").clientWidth;
const gridHeight = document.querySelector(".grid").clientHeight;

let score = 0;
const scoreDisplay = document.querySelector("#score");
scoreDisplay.innerHTML = score;

let levelMultiplier = 1;
const blocksPerLvl = 8;

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

const userStart = [gridHeight - 70, 10];
let userCurrentPosition = userStart;

drawObject(user, userCurrentPosition);

// User movement
function moveUser(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (userCurrentPosition[0] > 5) {
        userCurrentPosition[0] -= 5;
        drawObject(user, userCurrentPosition);
      }
      break;
    case "ArrowRight":
      if (userCurrentPosition[0] < gridWidth - (userWidth + 5)) {
        userCurrentPosition[0] += 5;
        drawObject(user, userCurrentPosition);
      }
    default:
      break;
  }
}

document.addEventListener("keydown", moveUser);

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
  isGameOver();
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

function isGameOver() {
  let yBottomCollide = ballCurrentPosition[1] <= 0;

  // Check if Game Over
  if (yBottomCollide) {
    clearInterval(timerId);
    scoreDisplay.innerHTML = "Oops.. You Lose X_X";
    user.style.transform = "rotate(45deg)";
    user.style.transition = "all 0.5s";
    document.removeEventListener("keydown", moveUser);
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
