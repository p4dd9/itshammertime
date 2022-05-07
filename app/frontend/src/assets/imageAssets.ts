import IGameImageAsset from '../interfaces/IGameImageAsset';

import hammerImage from './images/hammer.png';
import woodyHammerImage from './images/woodyhammer.png';

import hammerEffectImage01 from './images/shatter_01.png';
import hammerEffectImage02 from './images/shatter_02.png';
import hammerEffectImage03 from './images/shatter_03.png';

import hammerEffectImage01Brown from './images/shatter_01_brown.png';
import hammerEffectImage02Brown from './images/shatter_02_brown.png';
import hammerEffectImage03Brown from './images/shatter_03_brown.png';

import gearImage from './images/gear.png';

// How to add new image
// 1. add alias here
// 2. add alias as key
// 3. use alias where you need it

// ASSET ALIAS
export const hammerImageAlias = {
	HAMMER: 'HAMMER_STATIC',
	HAMMER_PLANT: 'HAMMER_PLANT',

	HAMMER_EFFECT_01: 'HAMMER_EFFECT_01',
	HAMMER_EFFECT_02: 'HAMMER_EFFECT_02',
	HAMMER_EFFECT_03: 'HAMMER_EFFECT_03',

	HAMMER_EFFECT_01_BROWN: 'HAMMER_EFFECT_01_BROWN',
	HAMMER_EFFECT_02_BROWN: 'HAMMER_EFFECT_02_BROWN',
	HAMMER_EFFECT_03_BROWN: 'HAMMER_EFFECT_03_BROWN',
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

export const woodyHammerImageAssets: Map<string, IGameImageAsset> = new Map([
	[
		hammerImageAlias.HAMMER_PLANT,
		{
			src: woodyHammerImage,
			scaleOnCanvas: 5.5,
		},
	],
	[
		hammerImageAlias.HAMMER_EFFECT_01_BROWN,
		{
			src: hammerEffectImage01Brown,
			scaleOnCanvas: 2.5,
		},
	],
	[
		hammerImageAlias.HAMMER_EFFECT_02_BROWN,
		{
			src: hammerEffectImage02Brown,
			scaleOnCanvas: 2.5,
		},
	],
	[
		hammerImageAlias.HAMMER_EFFECT_03_BROWN,
		{
			src: hammerEffectImage03Brown,
			scaleOnCanvas: 2.5,
		},
	],
]);

export const classicHammerImageAssets: Map<string, IGameImageAsset> = new Map([
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
