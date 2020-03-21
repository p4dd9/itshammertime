import idleImage from './spritesheet/idle_static.png';
import walkRightImage from './spritesheet/sp_ludecat_right.png';
import walkLeftImage from './spritesheet/sp_ludecat_left.png';
import ISpriteSheetAsset from '../interfaces/ISpriteSheetAsset';

// !IMPORTANT
// Always update SPRITESHEETS enum in "spritesheets.ts" according to the order
const spriteSheetAssets: ISpriteSheetAsset[] = [
	{
		id: 'idle',
		animated: false,
		src: idleImage,
		spriteSheetColumCount: 12,
		spriteSheetRowCount: 12,
		scaleOnCanvas: 9.2,
	},
	{
		id: 'walk_right',
		animated: true,
		src: walkRightImage,
		spriteSheetColumCount: 12,
		spriteSheetRowCount: 12,
		scaleOnCanvas: 1,
	},
	{
		id: 'walk_left',
		animated: true,
		src: walkLeftImage,
		spriteSheetColumCount: 12,
		spriteSheetRowCount: 12,
		scaleOnCanvas: 1,
	},
];

export default spriteSheetAssets;
