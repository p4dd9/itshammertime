import hammerImage from './images/hammer.png';
import hammerEffectImage from './images/hammer_effect.png';
import IGameImageAsset from '../interfaces/IGameImageAsset';

export const weaponAlias = {
	HAMMER: 'HAMMER_STATIC',
	HAMMER_EFFECT: 'HAMMER_EFFECT',
};

export const weaponAssets: Map<string, IGameImageAsset> = new Map([
	[
		weaponAlias.HAMMER,
		{
			src: hammerImage,
			scaleOnCanvas: 3.5,
		},
	],
	[
		weaponAlias.HAMMER_EFFECT,
		{
			src: hammerEffectImage,
			scaleOnCanvas: 3.5,
		},
	],
]);
