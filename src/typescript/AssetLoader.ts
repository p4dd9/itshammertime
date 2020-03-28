import ISpriteSheet from '../interfaces/ISpriteSheet';
import IAudio from '../interfaces/IAudio';
import IGameAsset from '../interfaces/IGameImageAsset';
import IGameImage from '../interfaces/IGameImage';
import ISpriteSheetAsset from '../interfaces/ISpriteSheetAsset';
import IGameImageAsset from '../interfaces/IGameImageAsset';
import IAudioAsset from '../interfaces/IAudioAsset';
import LocalStorageUtil from '../util/LocalStorageUtil';
import GameAudio from './GameAudio';

export default class AssetLoader {
	public static async loadSpriteSheets(
		spritesheetAsets: Map<string, ISpriteSheetAsset>
	): Promise<Map<string, ISpriteSheet>> {
		const spriteSheets = await AssetLoader.loadSpriteSheetImages(
			spritesheetAsets
		);
		const spriteSheetMap = new Map<string, ISpriteSheet>();

		for (const spriteSheet of spriteSheets) {
			spriteSheetMap.set(spriteSheet.id, spriteSheet);
		}

		return spriteSheetMap;
	}

	private static async loadSpriteSheetImages(
		spritesheetAsets: Map<string, ISpriteSheetAsset>
	): Promise<ISpriteSheet[]> {
		const spriteSheetPromises = new Array<Promise<ISpriteSheet>>();

		for (const [
			spriteSheetAssetKey,
			spriteSheetAsset,
		] of spritesheetAsets.entries()) {
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
				image.onload = (): void => {
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

	public static async loadImages(
		imageAssets: Map<string, IGameImageAsset>
	): Promise<Map<string, IGameImage>> {
		const images = await AssetLoader.loadImagesAssets(imageAssets);
		const imageMap = new Map<string, IGameImage>();

		for (const imageAsset of images) {
			imageMap.set(imageAsset.id, imageAsset);
		}

		return imageMap;
	}

	public static async loadImagesAssets(
		images: Map<string, IGameAsset>
	): Promise<IGameImage[]> {
		const imagePromises = new Array<Promise<IGameImage>>();

		for (const [imageAssetKey, imageAsset] of images.entries()) {
			const image: HTMLImageElement = new Image();
			const { src, scaleOnCanvas } = imageAsset;
			image.src = src;

			const imagePromise = new Promise<IGameImage>(resolve => {
				image.onload = (): void => {
					resolve({
						id: imageAssetKey,
						img: image,
						scaleOnCanvas,
					});
				};
			});
			imagePromises.push(imagePromise);
		}

		return Promise.all(imagePromises);
	}

	public static async loadAudio(
		audioAssets: Map<string, IAudioAsset>
	): Promise<Map<string, IAudio>> {
		const loadedAudioAssets = await AssetLoader.loadAudioAssets(
			audioAssets
		);
		const audioAssetMap = new Map<string, IAudio>();

		for (const audioAsset of loadedAudioAssets) {
			audioAssetMap.set(audioAsset.id, audioAsset);
		}

		return audioAssetMap;
	}

	public static async loadAudioAssets(
		audioAssets: Map<string, IAudioAsset>
	): Promise<IAudio[]> {
		const audioPromises = new Array<Promise<IAudio>>();

		for (const [key, audioAsset] of audioAssets.entries()) {
			const audio = new Audio(audioAsset.src);
			audio.volume =
				GameAudio.volumeRange[LocalStorageUtil.getVolumeIndex() || 0];

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
