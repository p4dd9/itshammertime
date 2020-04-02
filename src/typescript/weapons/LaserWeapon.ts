import Weapon from '../Weapon';
import { laserImageAssets, laserImageAlias } from '../../assets/imageAssets';
import { laserAudioAssets, laserAudioAlias } from '../../assets/audioAssets';
import GameAudio from '../GameAudio';
import LaserVFX from '../weaponeffects/LaserVFX';
import IPosition from '../../interfaces/IPosition';

export default class LaserWeapon extends Weapon {
	private laserOn = false;

	protected imageAssets = laserImageAssets;
	protected audioAssets = laserAudioAssets;

	constructor(context: CanvasRenderingContext2D, position: IPosition) {
		super(
			context,
			position,
			laserImageAssets,
			laserAudioAssets,
			laserImageAlias.LASER_STATIC,
			laserAudioAlias.LASER_CLICK_ON
		);

		this.use = this.use.bind(this);
		this.stopUse = this.stopUse.bind(this);
		this.addEventListeners = this.addEventListeners.bind(this);
		this.removeEventListeners = this.removeEventListeners.bind(this);
	}

	public draw(): void {
		const { currentImage: image, position } = this;
		if (image === undefined) {
			return;
		}

		if (this.laserOn) {
			(this.effect[0] as LaserVFX).drawWithPosition(
				position.x + image.image.width / image.scaleOnCanvas / 2 - 5,
				position.y - image.image.height / image.scaleOnCanvas
			);
		}

		this.context.drawImage(
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

	protected addEventListeners(): void {
		this.context.canvas.addEventListener('mousedown', this.use);
		this.context.canvas.addEventListener('mouseup', this.stopUse);
	}

	public removeEventListeners(): void {
		this.context.canvas.removeEventListener('mousedown', this.use);
		this.context.canvas.removeEventListener('mouseup', this.stopUse);
	}

	private stopUse(): void {
		this.effect = [];

		GameAudio.playSound(
			this.audio!.get(laserAudioAlias.LASER_CLICK_OFF)!.audio
		);
		GameAudio.stopLoop(this.currentAudio!.audio);
		this.laserOn = false;
	}

	protected use(): void {
		this.effect = [new LaserVFX(this.context, this.position)];
		this.currentAudio = this.audio!.get(laserAudioAlias.LASER_BEAM);
		GameAudio.loop(this.currentAudio!.audio);
		this.laserOn = true;
	}
}
