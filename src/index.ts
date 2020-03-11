import p5Type from 'p5';

import * as constants from './constants';
import bgFile from './assets/bg.png';
import textureFile from './assets/texture.png';

declare const p5: any;

const sketch = (p: p5Type) => {
  let player: Car;
  let bg: Background;
  let border: Border;
  let baseTexture: p5Type.Image;
  let bgImage: p5Type.Image;
  let cars: Car[] = [];
  let score = 0;
  let BORDER_SPEED = constants.FRAME_RATE / 4;

  p.preload = () => {
    baseTexture = p.loadImage(textureFile);
    bgImage = p.loadImage(bgFile);
  };

  p.setup = () => {
    p.frameRate(constants.FRAME_RATE);
    p.createCanvas(constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
    bg = new Background();

    const playerYOffset =
      constants.BLOCK_FULL_WIDTH * (constants.BLOCKS_COUNT_Y - 6);
    player = new Car(constants.CAR_POSITION.RIGHT, playerYOffset);

    border = new Border();
  };

  p.draw = () => {
    bg.draw();

    border.update();
    border.draw();

    p.textSize(24);
    p.text(`Score: ${score}`, 40, 30);

    if (p.frameCount % constants.FRAME_RATE === 0) {
      score += 1;
    }

    player.draw();

    if (p.frameCount % (constants.FRAME_RATE * 3) === 0 || p.frameCount === 1) {
      cars.push(
        new Car(
          Math.random() > 0.5
            ? constants.CAR_POSITION.RIGHT
            : constants.CAR_POSITION.LEFT,
          -(constants.BLOCK_FULL_WIDTH * 4),
          true
        )
      );
    }
    for (let i = 0; i < cars.length; i++) {
      cars[i].update();
      cars[i].draw();
      if (cars[i].y > constants.CANVAS_HEIGHT) {
        cars.splice(i, 1);
      }
      if (player.hits(cars[i])) {
        cars = [];
        score = 0;
        break;
      }
    }
  };

  p.keyPressed = () => {
    if (
      p.keyCode === p.LEFT_ARROW &&
      player.x === constants.CAR_POSITION.RIGHT
    ) {
      player.x = constants.CAR_POSITION.LEFT;
    }

    if (
      p.keyCode === p.RIGHT_ARROW &&
      player.x === constants.CAR_POSITION.LEFT
    ) {
      player.x = constants.CAR_POSITION.RIGHT;
    }
  };

  class BlockTexture {
    constructor(public x: number, public y: number, private size: number) {}

    draw() {
      p.image(baseTexture, this.x, this.y, this.size, this.size);
    }
  }

  class Background {
    draw() {
      p.image(bgImage, 0, 0);
    }
  }

  class Car {
    public blocks: BlockTexture[] = [];
    public width = constants.BLOCK_WIDTH;

    constructor(private _x: number, private _y: number, private move = false) {
      this.setup();
    }

    setup() {
      for (let yAxis = 0; yAxis < constants.CAR_MATRIX.length; yAxis++) {
        for (
          let xAxis = 0;
          xAxis < constants.CAR_MATRIX[yAxis].length;
          xAxis++
        ) {
          const shouldDrawBlock = constants.CAR_MATRIX[yAxis][xAxis] !== 0;
          if (shouldDrawBlock) {
            this.blocks.push(
              new BlockTexture(
                this.x + constants.BLOCK_FULL_WIDTH * xAxis,
                this.y + constants.BLOCK_FULL_WIDTH * yAxis,
                this.width
              )
            );
          }
        }
      }
    }

    get x() {
      return this._x;
    }

    set x(value) {
      this._x = value;
      let movementSize = constants.BLOCK_FULL_WIDTH * 3;
      if (value === constants.CAR_POSITION.LEFT) {
        movementSize *= -1;
      }
      this.blocks.forEach(block => {
        block.x += movementSize;
      });
    }

    get y() {
      return this._y;
    }

    set y(value) {
      this._y = value;
      const leftTopBlockPosition = this.blocks[0].y;
      this.blocks.forEach(block => {
        block.y = block.y - leftTopBlockPosition + value;
      });
    }

    update() {
      if (this.move) {
        if (p.frameCount % (constants.FRAME_RATE / 4) === 0) {
          this.y = this.y + constants.BLOCK_FULL_WIDTH;
        }
      }
    }

    draw() {
      this.blocks.forEach(block => {
        block.draw();
      });
    }

    hits(car) {
      const carHeight = constants.BLOCK_FULL_WIDTH * 4;
      const carWidth = constants.BLOCK_FULL_WIDTH * 3;
      if (this.x === car.x && this.y >= car.y && car.y + carHeight > this.y) {
        return true;
      }
    }
  }

  class BorderItem {
    public blocks: BlockTexture[] = [];

    constructor(private x: number, private y: number, private height = 3) {
      this.setup();
    }

    setup() {
      for (let i = 0; i < this.height; i++) {
        this.blocks.push(
          new BlockTexture(
            this.x,
            this.y + i * constants.BLOCK_FULL_WIDTH,
            constants.BLOCK_WIDTH
          )
        );
      }
    }

    update() {
      if (p.frameCount % BORDER_SPEED === 0) {
        this.blocks.forEach((block, index) => {
          block.y = block.y + constants.BLOCK_FULL_WIDTH;
          if (block.y > constants.CANVAS_HEIGHT) {
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
    public borderItems: BorderItem[] = [];

    constructor(private spacing = constants.BLOCK_FULL_WIDTH) {
      this.setup();
    }

    setup() {
      for (let i = 0; i < 5; i++) {
        this.borderItems.push(
          new BorderItem(
            constants.BORDER_POSITION.LEFT,
            i * constants.BLOCK_FULL_WIDTH * 4
          )
        );
        this.borderItems.push(
          new BorderItem(
            constants.BORDER_POSITION.RIGHT,
            i * constants.BLOCK_FULL_WIDTH * 4
          )
        );
      }
    }

    update() {
      if (p.frameCount % (BORDER_SPEED * 4) === 1 || p.frameCount === 1) {
        const leftBorder = new BorderItem(
          constants.BORDER_POSITION.LEFT,
          -(constants.BLOCK_FULL_WIDTH * 4)
        );
        this.borderItems.push(leftBorder);

        const rightBorder = new BorderItem(
          constants.BORDER_POSITION.RIGHT,
          -(constants.BLOCK_FULL_WIDTH * 4)
        );
        this.borderItems.push(rightBorder);
      }

      this.borderItems.forEach(b => {
        b.update();
      });

      if (p.frameCount % (BORDER_SPEED * 20) === 0) {
        this.borderItems.splice(0, this.borderItems.length - 10);
      }
    }

    draw() {
      this.borderItems.forEach(b => {
        b.draw();
      });
    }
  }
};

new p5(sketch);
