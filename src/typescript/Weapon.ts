import IGameImage from '../interfaces/IGameImage';
import AssetLoader from './AssetLoader';
import IAudio from '../interfaces/IAudio';
import CanvasCursor from './CanvasCursor';
import WeaponEffect from './WeaponVFX';
import IGameImageAsset from '../interfaces/IGameImageAsset';
import IAudioAsset from '../interfaces/IAudioAsset';

export default abstract class Weapon {
	public image: IGameImage | undefined = undefined;
	public images: Map<string, IGameImage> | null = null;
	public audio: Map<string, IAudio> | null = null;

	protected currentAudio: IAudio | undefined = undefined;
	protected canvasCursor: CanvasCursor;
	protected context: CanvasRenderingContext2D;
	protected gameWeaponEffect: WeaponEffect[] = [] as WeaponEffect[];

	protected abstract imageAssets: Map<string, IGameImageAsset>;
	protected abstract audioAssets: Map<string, IAudioAsset>;

	constructor(
		context: CanvasRenderingContext2D,
		canvasCursor: CanvasCursor,
		imageAssets: Map<string, IGameImageAsset>,
		audioAssets: Map<string, IAudioAsset>,
		imageAlias: string,
		audioAlias: string
	) {
		this.canvasCursor = canvasCursor;
		this.context = context;

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

		this.addEventListeners();
	}

	public abstract draw(): void;
	public abstract removeEventListeners(): void;
	protected abstract addEventListeners(): void;
	protected abstract use(): void;
}
