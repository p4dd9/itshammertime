import IAudioAsset from '../interfaces/IAudioAsset';
import heavyGlassShatter1 from '../assets/audio/heavy_glass_shatter_1.wav';

// How to add new Audio
// 1. add alias here
// 2. add alias as key
// 3. use alias where you need it
export const hammerAudioAlias = {
	HAMMER_SHATTER: 'HAMMER_SHATTER',
};

export const hammerAudioAssets: Map<string, IAudioAsset> = new Map([
	[
		hammerAudioAlias.HAMMER_SHATTER,
		{
			src: heavyGlassShatter1,
		},
	],
]);
