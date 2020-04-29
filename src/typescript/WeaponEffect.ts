import IGameImage from '../interfaces/IGameImage';
import AssetLoader from './AssetLoader';
import IPosition from '../interfaces/IPosition';
import IGameImageAsset from '../interfaces/IGameImageAsset';
import IAudioAsset from '../interfaces/IAudioAsset';
import IAudio from '../interfaces/IAudio';
import GameAudio from './GameAudio';
import { hammerImageAlias } from '../assets/imageAssets';
import IEffectSettings from '../interfaces/IEffectSettings';
import { getRandomInt } from '../util/commonUtil';
import { hammerAudioAlias } from '../assets/audioAssets';

export default abstract class WeaponEffect {
	public currentImage: IGameImage | undefined = undefined;
	public currentAudio: IAudio | undefined = undefined;

	public images: Map<string, IGameImage> | null = null;
	public audio: Map<string, IAudio> | null = null;

	private gameAudio: GameAudio;
	protected contexts: CanvasRenderingContext2D[];
	protected effectPosition: IPosition;
	protected effectSettings: IEffectSettings;

	private static effectCount = 0;

	constructor(
		contexts: CanvasRenderingContext2D[],
		position: IPosition,
		effectSettings: IEffectSettings,
		gameAudio: GameAudio,
		imageAssets: Map<string, IGameImageAsset>,
		audioAssets: Map<string, IAudioAsset>,
		audioAlias?: string,
		imageAlias?: string
	) {
		this.contexts = contexts;
		this.effectSettings = effectSettings;
		this.gameAudio = gameAudio;

		this.effectPosition = {
			x: position.x,
			y: position.y,
		};

		this.loadAssets(imageAssets, audioAssets, audioAlias, imageAlias);
	}

	protected async loadAssets(
		imageAssets: Map<string, IGameImageAsset>,
		audioAssets: Map<string, IAudioAsset>,
		audioAlias?: string,
		imageAlias?: string
	): Promise<void> {
		const images = await AssetLoader.loadImages(imageAssets);
		const audio = await AssetLoader.loadAudio(audioAssets);

		this.images = images;
		this.audio = audio;

		this.currentAudio =
			typeof audioAlias === 'string'
				? audio.get(audioAlias)
				: this.setRandomAudioEffect();
		this.currentImage =
			typeof imageAlias === 'string'
				? images.get(imageAlias)
				: this.setWeaponEffectImage();

		if (this.currentAudio !== undefined) {
			this.currentAudio.audio.volume = GameAudio.volumeRange[this.gameAudio.volumeIndex];
			this.gameAudio.playSoundOverlap(this.currentAudio.audio);
		}
	}

	private setRandomAudioEffect(): IAudio | undefined {
		switch (getRandomInt(3)) {
			case 0: {
				return this.audio?.get(hammerAudioAlias.HAMMER_SHATTER_01);
			}
			case 1: {
				return this.audio?.get(hammerAudioAlias.HAMMER_SHATTER_02);
			}
			case 2: {
				return this.audio?.get(hammerAudioAlias.HAMMER_SHATTER_03);
			}
		}
	}

	private setWeaponEffectImage(): IGameImage | undefined {
		if (WeaponEffect.effectCount === 2) {
			WeaponEffect.effectCount = 0;
		}
		switch (WeaponEffect.effectCount) {
			case 0: {
				WeaponEffect.effectCount++;
				return this.images?.get(hammerImageAlias.HAMMER_EFFECT_01);
			}
			case 1: {
				WeaponEffect.effectCount++;
				return this.images?.get(hammerImageAlias.HAMMER_EFFECT_02);
			}
			case 2: {
				WeaponEffect.effectCount++;
				return this.images?.get(hammerImageAlias.HAMMER_EFFECT_03);
			}
		}
	}

	public abstract draw(): void;
}
