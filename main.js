const SCREEN_PROPOTION = 1.8;
const BLOCK_WIDTH = 35;
const BLOCK_SPACING = 5;
const BLOCKS_COUNT = 10;

const CANVAS_WIDTH = (BLOCK_WIDTH + BLOCK_SPACING) * BLOCKS_COUNT;
const CANVAS_HEIGHT = CANVAS_WIDTH * SCREEN_PROPOTION;

let player;
let carTexture;
let bg;

function preload() {
  carTexture = loadImage('assets/texture.png');
}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  // background(199, 255, 206);

  player = new Car();
  player.setup();

  bg = new Background(BLOCKS_COUNT, BLOCK_SPACING);
  bg.setup();
}

function draw() {}

class Background {
  constructor(countX, spacing) {
    this.opacity = 0.3;
    this.spacing = spacing;
    this.countX = countX;
    this.countY = this.countX * SCREEN_PROPOTION;
  }

  setup() {
    tint(255, 15);
    for (let i = 0; i < this.countX; i++) {
      for (let j = 0; j < this.countY; j++) {
        new BlockTexture(
          i * (BLOCK_WIDTH + BLOCK_SPACING),
          j * (BLOCK_WIDTH + BLOCK_SPACING),
          BLOCK_WIDTH,
        ).setup();
      }
    }
  }
}

class BlockTexture {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  setup() {
    image(carTexture, this.x, this.y, this.size, this.size);
  }
}

class Car {
  constructor() {
    this.width = BLOCK_WIDTH;
  }

  setup() {
    // image(carTexture, this.width, this.width, this.width, this.width);
  }

  draw() {}
}
