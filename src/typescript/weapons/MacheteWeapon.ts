import Weapon from '../Weapon';
import {
	macheteImageAssets,
	macheteImageAlias,
} from '../../assets/imageAssets';
import {
	macheteAudioAssets,
	macheteAudioAlias,
} from '../../assets/audioAssets';
import IPosition from '../../interfaces/IPosition';

export default class MacheteWeapon extends Weapon {
	public imageAssets = macheteImageAssets;
	public audioAssets = macheteAudioAssets;

	constructor(context: CanvasRenderingContext2D, position: IPosition) {
		super(
			context,
			position,
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

	public use(): void {
		console.log('IT MUST DO SOMETHING');
	}

	public draw(): void {
		const { currentImage: image, context, position } = this;
		if (image === undefined) {
			return;
		}

		context.drawImage(
			image.image,
			0,
			0,
			image.image.width,
			image.image.height,
			position.x,
			position.y,
			image.image.width / image.scaleOnCanvas,
			image.image.height / image.scaleOnCanvas
		);
	}
}
