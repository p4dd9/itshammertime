import IGameImage from '../interfaces/IGameImage';
import AssetLoader from './AssetLoader';
import IPosition from '../interfaces/IPosition';
import IGameImageAsset from '../interfaces/IGameImageAsset';
import IAudioAsset from '../interfaces/IAudioAsset';
import IAudio from '../interfaces/IAudio';
import GameAudio from './GameAudio';
import { hammerImageAlias } from '../assets/imageAssets';

export default abstract class WeaponEffect {
	public currentImage: IGameImage | undefined = undefined;
	public currentAudio: IAudio | undefined = undefined;

	public images: Map<string, IGameImage> | null = null;
	public audio: Map<string, IAudio> | null = null;

	protected context: CanvasRenderingContext2D;
	protected effectPosition: IPosition;

	private static effectCount = 0;

	constructor(
		context: CanvasRenderingContext2D,
		position: IPosition,
		imageAssets: Map<string, IGameImageAsset>,
		audioAssets: Map<string, IAudioAsset>,
		audioAlias: string,
		imageAlias?: string
	) {
		this.context = context;

		this.effectPosition = {
			x: position.x,
			y: position.y,
		};

		this.loadAssets(imageAssets, audioAssets, audioAlias, imageAlias);
	}

	protected async loadAssets(
		imageAssets: Map<string, IGameImageAsset>,
		audioAssets: Map<string, IAudioAsset>,
		audioAlias: string,
		imageAlias?: string
	): Promise<void> {
		const images = await AssetLoader.loadImages(imageAssets);
		const audio = await AssetLoader.loadAudio(audioAssets);

		this.images = images;
		this.audio = audio;

		this.currentAudio = audio.get(audioAlias);
		this.currentImage =
			typeof imageAlias === 'string'
				? images.get(imageAlias)
				: this.setWeaponEffectImage();

		GameAudio.playSoundOverlap(this.currentAudio!.audio);
	}

	// TODO: Refactor access of effects if  more images that 1 is provided
	// 		 not only hammer effects
	private setWeaponEffectImage(): IGameImage | undefined {
		if (WeaponEffect.effectCount === 2) {
			WeaponEffect.effectCount = 0;
		}
		switch (WeaponEffect.effectCount) {
			case 0: {
				WeaponEffect.effectCount++;
				return this.images!.get(hammerImageAlias.HAMMER_EFFECT_01);
			}
			case 1: {
				WeaponEffect.effectCount++;
				return this.images!.get(hammerImageAlias.HAMMER_EFFECT_02);
			}
			case 2: {
				WeaponEffect.effectCount++;
				return this.images!.get(hammerImageAlias.HAMMER_EFFECT_03);
			}
			default: {
				return undefined;
			}
		}
	}

	public abstract draw(): void;
}
