import IGameImage from '../interfaces/IGameImage';
import AssetLoader from './AssetLoader';
import IPosition from '../interfaces/IPosition';
import IGameImageAsset from '../interfaces/IGameImageAsset';
import IAudioAsset from '../interfaces/IAudioAsset';
import IAudio from '../interfaces/IAudio';
import GameAudio from './GameAudio';

export default abstract class WeaponEffect {
	public image: IGameImage | undefined = undefined;
	public images: Map<string, IGameImage> | null = null;
	public audio: Map<string, IAudio> | null = null;

	protected currentAudio: IAudio | undefined = undefined;
	protected _context: CanvasRenderingContext2D;

	protected _effectPosition: IPosition;

	constructor(
		context: CanvasRenderingContext2D,
		position: IPosition,
		imageAssets: Map<string, IGameImageAsset>,
		audioAssets: Map<string, IAudioAsset>,
		imageAlias: string,
		audioAlias: string
	) {
		this._context = context;

		this._effectPosition = {
			x: position.x,
			y: position.y,
		};

		console.log('Commit me: ' + this.images);
		this.loadAssets(imageAssets, audioAssets, imageAlias, audioAlias);
	}

	protected async loadAssets(
		imageAssets: Map<string, IGameImageAsset>,
		audioAssets: Map<string, IAudioAsset>,
		imageAlias: string,
		audioAlias: string
	): Promise<void> {
		const images = await AssetLoader.loadImages(imageAssets);
		const audio = await AssetLoader.loadAudio(audioAssets);

		this.images = images;
		this.audio = audio;

		this.currentAudio = audio.get(audioAlias);
		this.image = images.get(imageAlias);

		GameAudio.playSoundOverlap(this.currentAudio!.audio);
	}

	public abstract draw(): void;
}
