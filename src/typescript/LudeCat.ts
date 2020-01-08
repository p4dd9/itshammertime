import IPosition from '../interfaces/IPosition';
import ANIMATION from '../enums/spritesheets';

export default class LudeCat {
	private static _instance: LudeCat;

	private _moving = false;
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

	public get moving(): boolean {
		return this._moving;
	}

	public set moving(moving: boolean) {
		if (moving !== this._moving) {
			this._moving = moving;
			if (moving) {
				this._spritesheet = this._spritesheets[ANIMATION.WALK_RIGHT];
			} else {
				// this._spritesheet = this._spritesheets[ANIMATION.IDLE];
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
