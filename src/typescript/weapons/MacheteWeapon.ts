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
		const { image, context, canvasCursor } = this;
		if (image === undefined) {
			return;
		}

		context.drawImage(
			image.img,
			0,
			0,
			image.img.width,
			image.img.height,
			canvasCursor.mousePosition.x,
			canvasCursor.mousePosition.y,
			image.img.width / image.scaleOnCanvas,
			image.img.height / image.scaleOnCanvas
		);
	}
}
