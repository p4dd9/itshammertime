import idleBlinktailWhipheadSpriteSheet from '../assets/spritesheet/idle_blinktailwhiphead.png';
import catWalkRight from '../assets/spritesheet/sp_ludecat_right.png';
import catWalkLeft from '../assets/spritesheet/sp_ludecat_left.png';

import meowSound from '../assets/audio/meow.mp3';
import meow2Sound from '../assets/audio/meow2.wav';
import nyaSound from '../assets/audio/nya.wav';

import IAudioAsset from '../interfaces/IAudioAsset';
import LudeCat from './LudeCat';
import ANIMATION from '../enums/spritesheets';

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

	// TODO: Could use promises here, chain em
	// TODO: return images to cat in contructor / Promises
	// TODO: Game.characters
	public static loadImages(callback: () => void) {
		let loadedImageCount: number = 0;
		const images: HTMLImageElement[] = new Array() as HTMLImageElement[];

		// Update enum ANIMATION
		const imagePaths: string[] = [
			idleBlinktailWhipheadSpriteSheet,
			catWalkRight,
			catWalkLeft,
		];

		for (const imagePath of imagePaths) {
			const image: HTMLImageElement = new Image();
			image.onload = imageLoaded;
			image.src = imagePath;
			images.push(image);
		}

		function imageLoaded(e: Event) {
			loadedImageCount++;
			if (loadedImageCount >= imagePaths.length) {
				console.log(`All images (${imagePaths.length}) loaded.`);
				LudeCat.getInstance().spritesheets = images;
				LudeCat.getInstance().spritesheet = images[ANIMATION.IDLE];
				callback();
			}
		}
	}

	// TODO: use audio instance, avoid dom
	public static loadAudio() {
		for (const audioAsset in AssetLoader.audio) {
			if (AssetLoader.audio.hasOwnProperty(audioAsset)) {
				const audioItem = AssetLoader.audio[audioAsset];
				const audio = new Audio(audioItem.track);
				audio.volume = 0.5;
				audio.id = audioItem.id;

				const root = document.getElementById('root');
				root?.append(audio);
			}
		}
	}
}
