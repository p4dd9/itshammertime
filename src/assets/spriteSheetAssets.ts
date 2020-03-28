import idleImage from './spritesheet/tabi_sleep.png';
import walkRightImage from './spritesheet/tabi_walk_right.png';
import walkLeftImage from './spritesheet/tabi_walk_left.png';
import walkDownImage from './spritesheet/tabi_walk_down.png';
import walkUpImage from './spritesheet/tabi_walk_up.png';
import ISpriteSheetAsset from '../interfaces/ISpriteSheetAsset';

// How to add new Spritesheet
// 1. add alias here
// 2. add alias as key
// 3. use alias where you need it
export const ludeCatSpriteSheetAlias = {
	IDLE: 'IDLE',
	WALK_RIGHT: 'WALK_RIGHT',
	WALK_LEFT: 'WALK_LEFT',
	WALK_DOWN: 'WALK_DOWN',
	WALK_UP: 'WALK_UP',
};

export const ludeCatSpriteSheets: Map<string, ISpriteSheetAsset> = new Map([
	[
		ludeCatSpriteSheetAlias.IDLE,
		{
			animated: true,
			src: idleImage,
			spriteSheetColumCount: 4,
			spriteSheetRowCount: 1,
			scaleOnCanvas: 0.2,
		},
	],
	[
		ludeCatSpriteSheetAlias.WALK_LEFT,
		{
			animated: true,
			src: walkLeftImage,
			spriteSheetColumCount: 4,
			spriteSheetRowCount: 1,
			scaleOnCanvas: 0.2,
		},
	],
	[
		ludeCatSpriteSheetAlias.WALK_RIGHT,
		{
			animated: true,
			src: walkRightImage,
			spriteSheetColumCount: 4,
			spriteSheetRowCount: 1,
			scaleOnCanvas: 0.2,
		},
	],
	[
		ludeCatSpriteSheetAlias.WALK_UP,
		{
			animated: true,
			src: walkUpImage,
			spriteSheetColumCount: 4,
			spriteSheetRowCount: 1,
			scaleOnCanvas: 0.2,
		},
	],
	[
		ludeCatSpriteSheetAlias.WALK_DOWN,
		{
			animated: true,
			src: walkDownImage,
			spriteSheetColumCount: 4,
			spriteSheetRowCount: 1,
			scaleOnCanvas: 0.2,
		},
	],
]);
