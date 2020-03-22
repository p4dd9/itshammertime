import IAudioAsset from '../interfaces/IAudioAsset';

import meowSound from '../assets/audio/meow.mp3';
import meow2Sound from '../assets/audio/meow2.wav';
import nyaSound from '../assets/audio/nya.wav';

export const audioAlias = {
	MEOW: 'MEOW',
	MEOW2: 'MEOW2',
	NYA: 'NYA',
};

export const audioAssets: Map<string, IAudioAsset> = new Map([
	[
		audioAlias.MEOW,
		{
			id: audioAlias.MEOW,
			src: meowSound,
		},
	],
	[
		audioAlias.MEOW2,
		{
			id: audioAlias.MEOW2,
			src: meow2Sound,
		},
	],
	[
		audioAlias.NYA,
		{
			id: audioAlias.NYA,
			src: nyaSound,
		},
	],
]);
