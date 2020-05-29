import IAudioAsset from '../interfaces/IAudioAsset';
import heavyGlassShatter1 from './audio/heavy_glass_shatter_1.wav';
import heavyGlassShatter2 from './audio/heavy_glass_shatter_2.wav';
import heavyGlassShatter3 from './audio/heavy_glass_shatter_3.wav';

// How to add new Audio
// 1. add alias here
// 2. add alias as key
// 3. use alias where you need it
export const hammerAudioAlias = {
	HAMMER_SHATTER_01: 'HAMMER_SHATTER_01',
	HAMMER_SHATTER_02: 'HAMMER_SHATTER_02',
	HAMMER_SHATTER_03: 'HAMMER_SHATTER_03',
};

export const hammerAudioAssets: Map<string, IAudioAsset> = new Map([
	[
		hammerAudioAlias.HAMMER_SHATTER_01,
		{
			src: heavyGlassShatter1,
		},
	],
	[
		hammerAudioAlias.HAMMER_SHATTER_02,
		{
			src: heavyGlassShatter2,
		},
	],
	[
		hammerAudioAlias.HAMMER_SHATTER_03,
		{
			src: heavyGlassShatter3,
		},
	],
]);
