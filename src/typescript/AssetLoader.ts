import meowSound from '../assets/audio/meow.mp3';
import meow2Sound from '../assets/audio/meow2.wav';
import nyaSound from '../assets/audio/nya.wav';
import ISpriteSheet from '../interfaces/ISpriteSheet';
import spriteSheetAssets from '../assets/assets';

export default class AssetLoader {
	public static async loadSpriteSheets(): Promise<ISpriteSheet[]> {
		const imagePromises = new Array() as Array<Promise<ISpriteSheet>>;

		for (const spriteSheetAsset of spriteSheetAssets) {
			const image: HTMLImageElement = new Image();
			const {
				id,
				src,
				spriteSheetColumCount,
				spriteSheetRowCount,
				scaleOnCanvas,
				animated,
			} = spriteSheetAsset;
			image.src = src;

			const nP = new Promise<ISpriteSheet>(resolve => {
				image.onload = () => {
					resolve({
						id,
						img: image,
						animated,
						spriteSheetColumCount,
						spriteSheetRowCount,
						scaleOnCanvas,
					});
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
