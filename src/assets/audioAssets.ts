import IAudioAsset from '../interfaces/IAudioAsset';

import meowSound from '../assets/audio/meow.mp3';
import meow2Sound from '../assets/audio/meow2.wav';
import nyaSound from '../assets/audio/nya.wav';

import heavyGlassShatter1 from '../assets/audio/heavy_glass_shatter_1.wav';

// How to add new Audio
// 1. add alias here
// 2. add alias as key
// 3. use alias where you need it
export const ludeCatAudioAlias = {
	MEOW: 'MEOW',
	MEOW2: 'MEOW2',
	NYA: 'NYA',
};

export const weaponaudioAlias = {
	HAMMER: 'HAMMER',
};

export const weaponCursorAudioAssets: Map<string, IAudioAsset> = new Map([
	[
		weaponaudioAlias.HAMMER,
		{
			src: heavyGlassShatter1,
		},
	],
]);

export const ludeCatAudioAssets: Map<string, IAudioAsset> = new Map([
	[
		ludeCatAudioAlias.MEOW,
		{
			src: meowSound,
		},
	],
	[
		ludeCatAudioAlias.MEOW2,
		{
			src: meow2Sound,
		},
	],
	[
		ludeCatAudioAlias.NYA,
		{
			src: nyaSound,
		},
	],
]);
