import IPosition from '../interfaces/IPosition';

export default class LudeCat {
	private static instance: LudeCat;
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
}
