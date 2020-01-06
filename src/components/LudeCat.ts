import IPosition from '../interfaces/IPosition';

export default class LudeCat {
	private static instance: LudeCat;
	private _moving = false;
	private _spritesheets: HTMLImageElement[] = new Array() as HTMLImageElement[];
	private _spritesheet: HTMLImageElement = this._spritesheets[0];
	private _catPosition: IPosition = {
		x: 0,
		y: 0,
	};

	private constructor() {}

	public static getInstance(): LudeCat {
		if (!LudeCat.instance) {
			LudeCat.instance = new LudeCat();
		}

		return LudeCat.instance;
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
				this._spritesheet = this._spritesheets[1];
			} else {
				this._spritesheet = this._spritesheets[0];
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
