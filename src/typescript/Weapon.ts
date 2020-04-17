import IGameImage from '../interfaces/IGameImage';
import AssetLoader from './AssetLoader';
import IAudio from '../interfaces/IAudio';
import WeaponEffect from './WeaponEffect';
import IGameImageAsset from '../interfaces/IGameImageAsset';
import IAudioAsset from '../interfaces/IAudioAsset';
import IPosition from '../interfaces/IPosition';
import IEffectSettings from '../interfaces/IEffectSettings';
import LAYERS from '../config/layers';

export default abstract class Weapon {
	private moveDistance = 9;

	public currentImage: IGameImage | undefined = undefined;
	public currentAudio: IAudio | undefined = undefined;

	public images: Map<string, IGameImage> | null = null;
	public audio: Map<string, IAudio> | null = null;

	public position: IPosition;
	protected contexts: CanvasRenderingContext2D[];
	protected effects: WeaponEffect[] = [] as WeaponEffect[];
	protected effectSettings: IEffectSettings;

	protected abstract imageAssets: Map<string, IGameImageAsset>;
	protected abstract audioAssets: Map<string, IAudioAsset>;

	constructor(
		contexts: CanvasRenderingContext2D[],
		position: IPosition,
		effectSettings: IEffectSettings,
		imageAssets: Map<string, IGameImageAsset>,
		audioAssets: Map<string, IAudioAsset>,
		imageAlias: string,
		audioAlias: string
	) {
		this.position = position;
		this.contexts = contexts;
		this.effectSettings = effectSettings;

		this.loadAssets(imageAssets, audioAssets, imageAlias, audioAlias);
	}

	public resizeCanvas(canvasWidth: number, canvasHeight: number): void {
		for (const layer of this.contexts) {
			layer.canvas.width = canvasWidth;
			layer.canvas.height = canvasHeight;
		}
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
		this.currentImage = images.get(imageAlias);
	}

	public moveTo(x: number, y: number): void {
		this.position.x = x;
		this.position.y = y;
	}

	public moveRight(): void {
		if (this.currentImage === undefined) {
			return;
		}
		const canvasWidth = this.contexts[LAYERS.FRONT].canvas.width;
		const destinationX =
			this.position.x +
			this.moveDistance +
			this.currentImage.image.width / this.currentImage.scaleOnCanvas;

		if (destinationX <= canvasWidth) {
			this.position.x += this.moveDistance;
		}
	}

	public moveLeft(): void {
		if (this.currentImage === undefined) {
			return;
		}
		const destinationX =
			this.position.x -
			(this.moveDistance +
				this.currentImage.image.width /
					this.currentImage.scaleOnCanvas) /
				2;

		if (destinationX >= 0) {
			this.position.x += -this.moveDistance;
		}
	}

	public moveUp(): void {
		if (this.currentImage === undefined) {
			return;
		}
		const destinationY =
			this.position.y -
			(this.moveDistance +
				this.currentImage.image.height /
					this.currentImage.scaleOnCanvas);

		if (destinationY >= 0) {
			this.position.y += -this.moveDistance;
		}
	}

	public moveDown(): void {
		const canvasHeight = this.contexts[LAYERS.FRONT].canvas.height;
		const destinationY = this.position.y + this.moveDistance;

		if (destinationY < canvasHeight) {
			this.position.y += this.moveDistance;
		}
	}

	public abstract draw(): void;
	public abstract use(): void;
}
