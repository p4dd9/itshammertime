import Weapon from '../Weapon';
import {
	macheteImageAssets,
	macheteImageAlias,
} from '../../assets/imageAssets';
import {
	macheteAudioAssets,
	macheteAudioAlias,
} from '../../assets/audioAssets';
import CanvasCursor from '../CanvasCursor';

export default class MacheteWeapon extends Weapon {
	public imageAssets = macheteImageAssets;
	public audioAssets = macheteAudioAssets;

	constructor(context: CanvasRenderingContext2D, canvasCursor: CanvasCursor) {
		super(
			context,
			canvasCursor,
			macheteImageAssets,
			macheteAudioAssets,
			macheteImageAlias.MACHETE_STATIC,
			macheteAudioAlias.MACHETE
		);

		this.use = this.use.bind(this);
		this.addEventListeners = this.addEventListeners.bind(this);
		this.removeEventListeners = this.removeEventListeners.bind(this);
	}

	protected addEventListeners(): void {
		this.context.canvas.addEventListener('click', this.use);
	}

	public removeEventListeners(): void {
		this.context.canvas.removeEventListener('click', this.use);
	}

	protected use(): void {
		console.log('IT MUST DO SOMETHING');
	}

	public draw(): void {
		if (this.image === undefined) {
			return;
		}

		this.context.drawImage(
			this.image!.img,
			0,
			0,
			this.image!.img.width,
			this.image!.img.height,
			this.canvasCursor.mousePosition.x,
			this.canvasCursor.mousePosition.y,
			this.image!.img.width / this.image!.scaleOnCanvas,
			this.image!.img.height / this.image!.scaleOnCanvas
		);
	}
}
