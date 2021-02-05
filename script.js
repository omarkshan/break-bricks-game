const grid = document.querySelector(".grid");
const gridWidth = document.querySelector(".grid").clientWidth;
const gridHeight = document.querySelector(".grid").clientHeight;

const levelMultiplier = 1;

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
  for (let i = 0; i < levelMultiplier * 16; i++) {
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
