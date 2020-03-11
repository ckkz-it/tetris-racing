export const FRAME_RATE = 60;
export const SCREEN_PROPORTION = 1.8;
export const BLOCK_WIDTH = 35;
export const BLOCK_SPACING = 5;
export const BLOCK_FULL_WIDTH = BLOCK_WIDTH + BLOCK_SPACING;
export const BLOCKS_COUNT_X = 10;
export const BLOCKS_COUNT_Y = BLOCKS_COUNT_X * SCREEN_PROPORTION;

export const CANVAS_WIDTH = BLOCK_FULL_WIDTH * BLOCKS_COUNT_X;
export const CANVAS_HEIGHT = CANVAS_WIDTH * SCREEN_PROPORTION;

export const CAR_POSITION = {
  LEFT: BLOCK_FULL_WIDTH * 2,
  RIGHT: BLOCK_FULL_WIDTH * (BLOCKS_COUNT_X - 5),
};
export const CAR_MATRIX = [
  [0, 1, 0],
  [1, 1, 1],
  [0, 1, 0],
  [1, 0, 1],
];

export const BORDER_POSITION = {
  LEFT: 0,
  RIGHT: BLOCK_FULL_WIDTH * (BLOCKS_COUNT_X - 1),
};
