import idleBlinktailWhipheadSpriteSheet from '../assets/spritesheet/idle_blinktailwhiphead.png';
import catWalkRight from '../assets/spritesheet/sp_ludecat_right.png';
import catWalkLeft from '../assets/spritesheet/sp_ludecat_left.png';

import meowSound from '../assets/audio/meow.mp3';
import meow2Sound from '../assets/audio/meow2.wav';
import nyaSound from '../assets/audio/nya.wav';

import IAudioAsset from '../interfaces/IAudioAsset';

export default class AssetLoader {
	public static audio: IAudioAsset = {
		meow: {
			id: 'meow',
			track: meowSound,
		},
		nya: {
			id: 'nya',
			track: nyaSound,
		},
		meow2: {
			id: 'meow2',
			track: meow2Sound,
		},
	};

	public static async loadImages(): Promise<HTMLImageElement[]> {
		const imagePromises = new Array() as Array<Promise<HTMLImageElement>>;

		const imagePaths: string[] = [
			idleBlinktailWhipheadSpriteSheet,
			catWalkRight,
			catWalkLeft,
		];

		for (const imagePath of imagePaths) {
			const image: HTMLImageElement = new Image();
			image.src = imagePath;
			const nP = new Promise<HTMLImageElement>(resolve => {
				image.onload = () => {
					resolve(image);
				};
			});
			imagePromises.push(nP);
		}
		return Promise.all(imagePromises);
	}

	public static async loadAudio(): Promise<HTMLAudioElement[]> {
		const audioPromises = new Array() as Array<Promise<HTMLAudioElement>>;
		const root = document.getElementById('root');

		for (const audioAsset in AssetLoader.audio) {
			if (AssetLoader.audio.hasOwnProperty(audioAsset)) {
				const audioItem = AssetLoader.audio[audioAsset];
				const audio = new Audio(audioItem.track);
				audio.volume = 0.5;
				audio.id = audioItem.id;

				const nP = new Promise<HTMLAudioElement>(resolve => {
					audio.addEventListener('loadeddata', () => {
						root!.append(audio);
						resolve(audio);
					});
				});
				audioPromises.push(nP);
			}
		}

		return Promise.all(audioPromises);
	}
}
