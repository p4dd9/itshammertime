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
		const imagePromises = new Array() as Array<Promise<ISpriteSheet>>;

		for (const spriteSheetAsset of spriteSheetAssets.values()) {
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

	public static async loadAudio() {
		const loadedAudioAssets = await AssetLoader.loadAudioAssets();
		const audioAssetMap = new Map<string, IAudio>();

		for (const audioAsset of loadedAudioAssets) {
			audioAssetMap.set(audioAsset.id, audioAsset);
		}

		return audioAssetMap;
	}

	public static async loadAudioAssets(): Promise<IAudio[]> {
		const audioPromises = new Array() as Array<Promise<IAudio>>;

		for (const audioAsset of audioAssets.values()) {
			const audio = new Audio(audioAsset.src);

			const nP = new Promise<IAudio>(resolve => {
				audio.addEventListener('loadeddata', () => {
					resolve({
						id: audioAsset.id,
						audio,
					});
				});
			});
			audioPromises.push(nP);
		}

		return Promise.all(audioPromises);
	}
}
