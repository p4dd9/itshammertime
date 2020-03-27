import hammerImage from './images/hammer.png';
import hammerEffectImage from './images/hammer_effect.png';
import IGameImageAsset from '../interfaces/IGameImageAsset';

export const imageAlias = {
	HAMMER: 'HAMMER_STATIC',
	HAMMER_EFFECT: 'HAMMER_EFFECT',
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
]);
