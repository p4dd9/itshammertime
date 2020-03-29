import IAudioAsset from '../interfaces/IAudioAsset';

import meowSound from '../assets/audio/meow.mp3';
import meow2Sound from '../assets/audio/meow2.wav';
import nyaSound from '../assets/audio/nya.wav';
import heavyGlassShatter1 from '../assets/audio/heavy_glass_shatter_1.wav';
import laserBeamSound from '../assets/audio/laser_beam.wav';
import laserOnSound from '../assets/audio/metallic_click_on.wav';
import laserOffSound from '../assets/audio/metallic_click_off.wav';

// How to add new Audio
// 1. add alias here
// 2. add alias as key
// 3. use alias where you need it
export const audioAlias = {
	MEOW: 'MEOW',
	MEOW2: 'MEOW2',
	NYA: 'NYA',
};

export const hammerAudioAlias = {
	HAMMER: 'HAMMER',
};

export const macheteAudioAlias = {
	MACHETE: 'MACHETE',
};

export const laserAudioAlias = {
	LASER_CLICK_ON: 'LASER_CLICK_ON',
	LASER_CLICK_OFF: 'LASER_CLICK_OFF',
	LASER_BEAM: 'LASER_BEAM',
};

export const laserAudioAssets: Map<string, IAudioAsset> = new Map([
	[
		laserAudioAlias.LASER_CLICK_ON,
		{
			src: laserOnSound,
		},
	],
	[
		laserAudioAlias.LASER_CLICK_OFF,
		{
			src: laserOffSound,
		},
	],
	[
		laserAudioAlias.LASER_BEAM,
		{
			src: laserBeamSound,
		},
	],
]);

export const macheteAudioAssets: Map<string, IAudioAsset> = new Map([
	[
		macheteAudioAlias.MACHETE,
		{
			src: heavyGlassShatter1,
		},
	],
]);

export const hammerAudioAssets: Map<string, IAudioAsset> = new Map([
	[
		hammerAudioAlias.HAMMER,
		{
			src: heavyGlassShatter1,
		},
	],
]);

export const audioAssets: Map<string, IAudioAsset> = new Map([
	[
		audioAlias.MEOW,
		{
			src: meowSound,
		},
	],
	[
		audioAlias.MEOW2,
		{
			src: meow2Sound,
		},
	],
	[
		audioAlias.NYA,
		{
			src: nyaSound,
		},
	],
]);
