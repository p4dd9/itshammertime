import IGameImageAsset from '../interfaces/IGameImageAsset';

import hammerImage from './images/hammer.png';
import hammerEffectImage from './images/hammer_effect.png';
import macheteImage from './images/machete.png';

// How to add new image
// 1. add alias here
// 2. add alias as key
// 3. use alias where you need it

// ASSET ALIAS
export const hammerImageAlias = {
	HAMMER: 'HAMMER_STATIC',
	HAMMER_EFFECT: 'HAMMER_EFFECT',
};

export const macheteImageAlias = {
	MACHETE_STATIC: 'MACHETE_STATIC',
};

// ASSETS
export const macheteImageAssets: Map<string, IGameImageAsset> = new Map([
	[
		macheteImageAlias.MACHETE_STATIC,
		{
			src: macheteImage,
			scaleOnCanvas: 4.5,
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
		hammerImageAlias.HAMMER_EFFECT,
		{
			src: hammerEffectImage,
			scaleOnCanvas: 3.5,
		},
	],
	[
		macheteImageAlias.MACHETE_STATIC,
		{
			src: macheteImage,
			scaleOnCanvas: 4.5,
		},
	],
]);
