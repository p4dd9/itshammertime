import IGameImage from '../interfaces/IGameImage';
import AssetLoader from './AssetLoader';
import IAudio from '../interfaces/IAudio';
import WeaponEffect from './WeaponEffect';
import IGameImageAsset from '../interfaces/IGameImageAsset';
import IAudioAsset from '../interfaces/IAudioAsset';
import IPosition from '../interfaces/IPosition';

export default abstract class Weapon {
	private moveDistance = 9;

	public currentImage: IGameImage | undefined = undefined;
	public currentAudio: IAudio | undefined = undefined;

	public images: Map<string, IGameImage> | null = null;
	public audio: Map<string, IAudio> | null = null;

	public position: IPosition;
	protected context: CanvasRenderingContext2D;
	protected effect: WeaponEffect[] = [] as WeaponEffect[];

	protected abstract imageAssets: Map<string, IGameImageAsset>;
	protected abstract audioAssets: Map<string, IAudioAsset>;

	constructor(
		context: CanvasRenderingContext2D,
		position: IPosition,
		imageAssets: Map<string, IGameImageAsset>,
		audioAssets: Map<string, IAudioAsset>,
		imageAlias: string,
		audioAlias: string
	) {
		this.position = position;
		this.context = context;

		this.loadAssets(imageAssets, audioAssets, imageAlias, audioAlias);
	}

	public resizeCanvas(canvasWidth: number, canvasHeight: number): void {
		this.context.canvas.height = canvasHeight;
		this.context.canvas.width = canvasWidth;
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

		this.start();
	}

	public moveRight(): void {
		const canvasWidth = this.context.canvas.width;
		const destinationX =
			this.position.x +
			this.moveDistance +
			this.currentImage!.image.width / this.currentImage!.scaleOnCanvas;

		if (destinationX <= canvasWidth) {
			this.position.x += this.moveDistance;
		}
	}

	public moveLeft(): void {
		const destinationX =
			this.position.x -
			(this.moveDistance +
				this.currentImage!.image.width /
					this.currentImage!.scaleOnCanvas) /
				2;

		if (destinationX >= 0) {
			this.position.x += -this.moveDistance;
		}
	}

	public moveUp(): void {
		const destinationY =
			this.position.y -
			(this.moveDistance +
				this.currentImage!.image.height /
					this.currentImage!.scaleOnCanvas);

		if (destinationY >= 0) {
			this.position.y += -this.moveDistance;
		}
	}

	public moveDown(): void {
		const canvasHeight = this.context.canvas.height;
		const destinationY = this.position.y + this.moveDistance;

		if (destinationY < canvasHeight) {
			this.position.y += this.moveDistance;
		}
	}

	public abstract draw(): void;
	public abstract stop(): void;
	public abstract start(): void;
	public abstract use(): void;
}
