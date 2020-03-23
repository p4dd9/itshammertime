import ISpriteSheet from '../interfaces/ISpriteSheet';
import { spriteSheetAssets } from '../assets/spritesheetAssets';
import IAudio from '../interfaces/IAudio';
import { audioAssets } from '../assets/audioAssets';

export default class AssetLoader {
	public static async loadSpriteSheets() {
		const spriteSheets = await AssetLoader.loadSpriteSheetImages();
		const spriteSheetMap = new Map<string, ISpriteSheet>();

		for (const spriteSheet of spriteSheets) {
			spriteSheetMap.set(spriteSheet.id, spriteSheet);
		}

		return spriteSheetMap;
	}

	private static async loadSpriteSheetImages(): Promise<ISpriteSheet[]> {
		const spriteSheetPromises = new Array<Promise<ISpriteSheet>>();

		for (const [
			spriteSheetAssetKey,
			spriteSheetAsset,
		] of spriteSheetAssets.entries()) {
			const image: HTMLImageElement = new Image();
			const {
				src,
				spriteSheetColumCount,
				spriteSheetRowCount,
				scaleOnCanvas,
				animated,
			} = spriteSheetAsset;
			image.src = src;

			const spriteSheetPromise = new Promise<ISpriteSheet>(resolve => {
				image.onload = () => {
					resolve({
						id: spriteSheetAssetKey,
						img: image,
						animated,
						spriteSheetColumCount,
						spriteSheetRowCount,
						scaleOnCanvas,
					});
				};
			});
			spriteSheetPromises.push(spriteSheetPromise);
		}

		return Promise.all(spriteSheetPromises);
	}

	public static async loadAudio() {
		const loadedAudioAssets = await AssetLoader.loadAudioAssets();
		const audioAssetMap = new Map<string, IAudio>();

		for (const audioAsset of loadedAudioAssets) {
			audioAssetMap.set(audioAsset.id, audioAsset);
		}

		return audioAssetMap;
	}

	public static async loadAudioAssets(): Promise<IAudio[]> {
		const audioPromises = new Array<Promise<IAudio>>();

		for (const [key, audioAsset] of audioAssets.entries()) {
			const audio = new Audio(audioAsset.src);

			const audioPromise = new Promise<IAudio>(resolve => {
				audio.addEventListener('loadeddata', () => {
					resolve({
						id: key,
						audio,
					});
				});
			});
			audioPromises.push(audioPromise);
		}

		return Promise.all(audioPromises);
	}
}
