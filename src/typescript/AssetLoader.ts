import idleBlinktailWhipheadSpriteSheet from '../assets/spritesheet/idle_blinktailwhiphead.png';
import idleBlinkHead from '../assets/spritesheet/idle_blinkhead.png';

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

	public static loadImages(callback: (images: HTMLImageElement[]) => void) {
		let loadedImageCount: number = 0;
		const images: HTMLImageElement[] = new Array() as HTMLImageElement[];

		const imagePaths: string[] = [
			idleBlinktailWhipheadSpriteSheet,
			idleBlinkHead,
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
				callback(images);
			}
		}
	}

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
