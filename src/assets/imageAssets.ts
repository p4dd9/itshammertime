import IGameImageAsset from '../interfaces/IGameImageAsset';

import hammerImage from './images/hammer.png';
import hammerEffectImage from './images/hammer_effect.png';

import macheteImage from './images/machete.png';

export const imageAlias = {
	HAMMER: 'HAMMER_STATIC',
	HAMMER_EFFECT: 'HAMMER_EFFECT',

	MACHETE_STATIC: 'MACHETE_STATIC',
};

export const imageAssets: Map<string, IGameImageAsset> = new Map([
	[
		imageAlias.HAMMER,
		{
			src: hammerImage,
			scaleOnCanvas: 3.5,
		},
	],
	[
		imageAlias.HAMMER_EFFECT,
		{
			src: hammerEffectImage,
			scaleOnCanvas: 3.5,
		},
	],
	[
		imageAlias.MACHETE_STATIC,
		{
			src: macheteImage,
			scaleOnCanvas: 4.5,
		},
	],
]);
