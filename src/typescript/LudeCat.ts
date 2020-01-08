import IPosition from '../interfaces/IPosition';
import ANIMATION from '../enums/spritesheets';
import LUDECATSTATE from '../enums/ludecatstate';

export default class LudeCat {
	private static _instance: LudeCat;

	private _moving: LUDECATSTATE = LUDECATSTATE.IDLE;
	private _spritesheets: HTMLImageElement[] = new Array() as HTMLImageElement[];
	private _spritesheet: HTMLImageElement = this._spritesheets[ANIMATION.IDLE];
	private _catPosition: IPosition = {
		x: 0,
		y: 0,
	};

	private constructor() {}

	public static getInstance(): LudeCat {
		if (!LudeCat._instance) {
			LudeCat._instance = new LudeCat();
		}

		return LudeCat._instance;
	}

	public get catPosition(): IPosition {
		return this._catPosition;
	}

	public set catPosition(value: IPosition) {
		this._catPosition = value;
	}

	public moving(moving: LUDECATSTATE) {
		if (moving !== this._moving) {
			this._moving = moving;
			if (moving) {
				if (this._moving === LUDECATSTATE.IDLE) {
					this._spritesheet = this._spritesheets[ANIMATION.IDLE];
					return;
				} else if (this._moving === LUDECATSTATE.WALKING_LEFT) {
					this._spritesheet = this._spritesheets[ANIMATION.WALK_LEFT];
					return;
				} else if (this._moving === LUDECATSTATE.WALKING_RIGHT) {
					this._spritesheet = this._spritesheets[
						ANIMATION.WALK_RIGHT
					];
					return;
				} else if (this._moving === LUDECATSTATE.WALKING_DOWN) {
					this._spritesheet = this._spritesheets[ANIMATION.IDLE];
					return;
				} else if (this._moving === LUDECATSTATE.WALKING_UP) {
					this._spritesheet = this._spritesheets[ANIMATION.IDLE];
					return;
				}
			} else {
				this._spritesheet = this._spritesheets[ANIMATION.IDLE];
			}
		}
	}

	public get spritesheet(): HTMLImageElement {
		return this._spritesheet;
	}
	public set spritesheet(image: HTMLImageElement) {
		this._spritesheet = image;
	}

	public get spritesheets(): HTMLImageElement[] {
		return this._spritesheets;
	}
	public set spritesheets(image: HTMLImageElement[]) {
		this._spritesheets = image;
	}
}
