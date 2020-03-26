import hammerImage from './images/hammer.png';
import IGameImageAsset from '../interfaces/IGameImageAsset';

export const weaponAlias = {
	HAMMER: 'HAMMER_STATIC',
};

export const weaponAssets: Map<string, IGameImageAsset> = new Map([
	[
		weaponAlias.HAMMER,
		{
			src: hammerImage,
			scaleOnCanvas: 1,
		},
	],
]);
