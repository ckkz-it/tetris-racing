const FRAME_RATE = 60;
const SCREEN_PROPOTION = 1.8;
const BLOCK_WIDTH = 35;
const BLOCK_SPACING = 5;
const BLOCK_FULL_WIDTH = BLOCK_WIDTH + BLOCK_SPACING;
const BLOCKS_COUNT_X = 10;
const BLOCKS_COUNT_Y = BLOCKS_COUNT_X * SCREEN_PROPOTION;

const CANVAS_WIDTH = BLOCK_FULL_WIDTH * BLOCKS_COUNT_X;
const CANVAS_HEIGHT = CANVAS_WIDTH * SCREEN_PROPOTION;

const CAR_POSITION = {
  LEFT: BLOCK_FULL_WIDTH * 2,
  RIGHT: BLOCK_FULL_WIDTH * (BLOCKS_COUNT_X - 5),
};
const CAR_MATRIX = [
  [0, 1, 0],
  [1, 1, 1],
  [0, 1, 0],
  [1, 0, 1],
];

const BORDER_POSITION = {
  LEFT: 0,
  RIGHT: BLOCK_FULL_WIDTH * (BLOCKS_COUNT_X - 1),
};
const BORDER_SPEED = FRAME_RATE / 2;

let player;
let baseTexture;
let bgImage;
let bg;
let border;

function preload() {
  baseTexture = loadImage('assets/texture.png');
  bgImage = loadImage('assets/bg.png');
}

function setup() {
  frameRate(FRAME_RATE);
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  bg = new Background();

  const playerYOffset = BLOCK_FULL_WIDTH * (BLOCKS_COUNT_Y - 6);
  player = new Player(CAR_POSITION.RIGHT, playerYOffset);
  player.setup();

  border = new Border();
  border.setup();
}

function draw() {
  bg.draw();

  border.update();
  border.draw();

  player.update();
  player.draw();
}

class BlockTexture {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  draw() {
    image(baseTexture, this.x, this.y, this.size, this.size);
  }
}

class Background {
  draw() {
    image(bgImage, 0, 0);
  }
}

class Car {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = BLOCK_WIDTH;
    this.blocks = [];
  }

  setup() {
    for (let yAxis = 0; yAxis < CAR_MATRIX.length; yAxis++) {
      for (let xAxis = 0; xAxis < CAR_MATRIX[yAxis].length; xAxis++) {
        const shouldDrawBlock = CAR_MATRIX[yAxis][xAxis] !== 0;
        if (shouldDrawBlock) {
          this.blocks.push(
            new BlockTexture(
              this.x + BLOCK_FULL_WIDTH * xAxis,
              this.y + BLOCK_FULL_WIDTH * yAxis,
              this.width,
            ),
          );
        }
      }
    }
  }

  update() {}

  draw() {
    this.blocks.forEach(block => {
      block.draw();
    });
  }
}

class Player extends Car {
  constructor(x, y) {
    super(x, y);
    this.currentPosition = CAR_POSITION.RIGHT;
    this.movementSize = BLOCK_FULL_WIDTH * 3;
  }

  update() {
    if (keyIsDown(LEFT_ARROW) && this.currentPosition === CAR_POSITION.RIGHT) {
      this.currentPosition = CAR_POSITION.LEFT;
      this.blocks.forEach(block => {
        block.x -= this.movementSize;
      });
    }

    if (keyIsDown(RIGHT_ARROW) && this.currentPosition === CAR_POSITION.LEFT) {
      this.currentPosition = CAR_POSITION.RIGHT;
      this.blocks.forEach(block => {
        block.x += this.movementSize;
      });
    }
  }
}

class BorderItem {
  constructor(x, y, height = 3) {
    this.x = x;
    this.y = y;
    this.blocks = [];
    this.height = height;
  }

  setup() {
    for (let i = 0; i < this.height; i++) {
      this.blocks.push(
        new BlockTexture(this.x, this.y + i * BLOCK_FULL_WIDTH, BLOCK_WIDTH),
      );
    }
  }

  update() {
    if (frameCount % BORDER_SPEED === 0) {
      this.blocks.forEach((block, index) => {
        block.y += BLOCK_FULL_WIDTH;
        if (block.y > CANVAS_HEIGHT) {
          this.blocks.splice(index, 1);
        }
      });
    }
  }

  draw() {
    this.blocks.forEach(block => {
      block.draw();
    });
  }

  clear() {
    this.blocks = [];
  }
}

class Border {
  constructor(spacing = BLOCK_FULL_WIDTH) {
    this.spacing = spacing;
    this.borderItems = [];
  }

  setup() {
    for (let i = 0; i < 5; i++) {
      this.borderItems.push(
        new BorderItem(BORDER_POSITION.LEFT, i * BLOCK_FULL_WIDTH * 4),
      );
      this.borderItems.push(
        new BorderItem(BORDER_POSITION.RIGHT, i * BLOCK_FULL_WIDTH * 4),
      );
    }

    this.borderItems.forEach(b => {
      b.setup();
    });
  }

  update() {
    if (frameCount % (BORDER_SPEED * 4) === 1 || frameCount === 1) {
      const leftBorder = new BorderItem(
        BORDER_POSITION.LEFT,
        -(BLOCK_FULL_WIDTH * 4),
      );
      leftBorder.setup();
      this.borderItems.push(leftBorder);

      const rightBorder = new BorderItem(
        BORDER_POSITION.RIGHT,
        -(BLOCK_FULL_WIDTH * 4),
      );
      rightBorder.setup();
      this.borderItems.push(rightBorder);
    }

    this.borderItems.forEach(b => {
      b.update();
    });

    if (frameCount % (BORDER_SPEED * 20) === 0) {
      this.borderItems.splice(0, this.borderItems.length - 10);
    }
  }

  draw() {
    this.borderItems.forEach(b => {
      b.draw();
    });
  }
}
