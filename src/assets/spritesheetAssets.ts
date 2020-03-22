import idleImage from './spritesheet/idle_static.png';
import walkRightImage from './spritesheet/sp_ludecat_right.png';
import walkLeftImage from './spritesheet/sp_ludecat_left.png';
import ISpriteSheetAsset from '../interfaces/ISpriteSheetAsset';

// How to add new Spritesheet
// 1. add alias here
// 2. add alias as key
// 3. use alias where you need it
export const spriteSheetAlias = {
	IDLE: 'IDLE',
	WALK_RIGHT: 'WALK_RIGHT',
	WALK_LEFT: 'WALK_LEFT',
};

export const spriteSheetAssets: Map<string, ISpriteSheetAsset> = new Map([
	[
		spriteSheetAlias.IDLE,
		{
			animated: false,
			src: idleImage,
			spriteSheetColumCount: 12,
			spriteSheetRowCount: 12,
			scaleOnCanvas: 9.2,
		},
	],
	[
		spriteSheetAlias.WALK_RIGHT,
		{
			animated: true,
			src: walkRightImage,
			spriteSheetColumCount: 12,
			spriteSheetRowCount: 12,
			scaleOnCanvas: 1,
		},
	],
	[
		spriteSheetAlias.WALK_LEFT,
		{
			animated: true,
			src: walkLeftImage,
			spriteSheetColumCount: 12,
			spriteSheetRowCount: 12,
			scaleOnCanvas: 1,
		},
	],
]);
