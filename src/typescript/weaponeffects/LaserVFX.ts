import WeaponVFX from '../WeaponVFX';
import { laserImageAssets, laserImageAlias } from '../../assets/imageAssets';
import { laserAudioAssets, laserAudioAlias } from '../../assets/audioAssets';
import IPosition from '../../interfaces/IPosition';

export default class LaserVFX extends WeaponVFX {
	constructor(context: CanvasRenderingContext2D, position: IPosition) {
		super(
			context,
			position,
			laserImageAssets,
			laserAudioAssets,
			laserImageAlias.LASER_STATIC,
			laserAudioAlias.LASER_CLICK_ON
		);
	}

	public drawWithPosition(x: number, y: number): void {
		if (this.image === undefined) {
			return;
		}

		const { context } = this;
		const lineWidth = 20;

		context.fillStyle = '#f00';
		context.fillRect(x, y, lineWidth / 2, 200);
	}

	public draw(): void {
		if (this.image === null || this.image === undefined) {
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
