import idleBlinktailWhipheadSpriteSheet from '../assets/spritesheet/idle_blinktailwhiphead.png';
import catWalkRight from '../assets/spritesheet/sp_ludecat_right.png';
import catWalkLeft from '../assets/spritesheet/sp_ludecat_left.png';

import meowSound from '../assets/audio/meow.mp3';
import meow2Sound from '../assets/audio/meow2.wav';
import nyaSound from '../assets/audio/nya.wav';

export default class AssetLoader {
	// !IMPORTANT
	// Always update SPRITESHEETS enum in "spritesheets.ts" according to the order
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

	// !IMPORTANT
	// Always update AUDIO enum in "audio.ts" according to the order
	public static async loadAudio(): Promise<HTMLAudioElement[]> {
		const audioPromises = new Array() as Array<Promise<HTMLAudioElement>>;
		const audioPaths: string[] = [meowSound, nyaSound, meow2Sound];

		for (const audioPath of audioPaths) {
			const audio = new Audio(audioPath);
			audio.volume = 0.2;

			const nP = new Promise<HTMLAudioElement>(resolve => {
				audio.addEventListener('loadeddata', () => {
					resolve(audio);
				});
			});
			audioPromises.push(nP);
		}

		return Promise.all(audioPromises);
	}
}
