import IGameImageAsset from '../interfaces/IGameImageAsset';

import hammerImage from './images/hammer.png';
import hammerEffectImage01 from './images/shatter_01.png';
import hammerEffectImage02 from './images/shatter_02.png';
import hammerEffectImage03 from './images/shatter_03.png';

import gearImage from './images/gear.png';

// How to add new image
// 1. add alias here
// 2. add alias as key
// 3. use alias where you need it

// ASSET ALIAS
export const hammerImageAlias = {
	HAMMER: 'HAMMER_STATIC',
	HAMMER_EFFECT_01: 'HAMMER_EFFECT_01',
	HAMMER_EFFECT_02: 'HAMMER_EFFECT_02',
	HAMMER_EFFECT_03: 'HAMMER_EFFECT_03',
};

export const uiImageAlias = {
	GEAR: 'GEAR',
};

export const uiImageAssets: Map<string, IGameImageAsset> = new Map([
	[
		uiImageAlias.GEAR,
		{
			src: gearImage,
			scaleOnCanvas: 3.5,
		},
	],
]);

export const hammerImageAssets: Map<string, IGameImageAsset> = new Map([
	[
		hammerImageAlias.HAMMER,
		{
			src: hammerImage,
			scaleOnCanvas: 3.5,
		},
	],
	[
		hammerImageAlias.HAMMER_EFFECT_01,
		{
			src: hammerEffectImage01,
			scaleOnCanvas: 2.5,
		},
	],
	[
		hammerImageAlias.HAMMER_EFFECT_02,
		{
			src: hammerEffectImage02,
			scaleOnCanvas: 2.5,
		},
	],
	[
		hammerImageAlias.HAMMER_EFFECT_03,
		{
			src: hammerEffectImage03,
			scaleOnCanvas: 2.5,
		},
	],
]);
