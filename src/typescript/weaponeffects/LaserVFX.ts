import WeaponEffect from '../WeaponEffect';
import { laserImageAssets, laserImageAlias } from '../../assets/imageAssets';
import { laserAudioAssets, laserAudioAlias } from '../../assets/audioAssets';
import IPosition from '../../interfaces/IPosition';

export default class LaserVFX extends WeaponEffect {
	constructor(context: CanvasRenderingContext2D, position: IPosition) {
		super(
			context,
			position,
			laserImageAssets,
			laserAudioAssets,
			laserAudioAlias.LASER_CLICK_ON,
			laserImageAlias.LASER_STATIC
		);
	}

	public drawWithPosition(x: number, y: number): void {
		if (this.currentImage === undefined) {
			return;
		}

		const { context } = this;
		const lineWidth = 20;

		context.fillStyle = '#f00';
		context.fillRect(x, y, lineWidth / 2, 200);
	}

	public draw(): void {
		if (this.currentImage === null || this.currentImage === undefined) {
			return;
		}

		const { context, effectPosition } = this;
		const lineWidth = 100;

		context.strokeStyle = '#f00';
		context.lineWidth = lineWidth;
		context.strokeRect(
			effectPosition.x,
			effectPosition.y,
			lineWidth / 2,
			lineWidth
		);
	}
}
