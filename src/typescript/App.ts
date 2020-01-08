import AssetLoader from './AssetLoader';
import Controller from './Controller';
import LudeCat from './LudeCat';
import {
	frameCount,
	scaleOnCanvas,
	spriteSheetColumCount,
	spriteSheetRowCount,
} from '../config/ludeCatConfig';
import CONTROLS from '../enums/controls';
import KeyboardManager from './KeyboardManager';

export default class App {
	private canvas: null | HTMLCanvasElement = document.getElementById('canvas')
		? (document.getElementById('canvas') as HTMLCanvasElement)
		: null;
	private _canvasContext: null | CanvasRenderingContext2D = null;

	// Spritesheet Stuff to render
	private _frameIndex = 0;
	private _rowIndex = 0;
	private _colIndex = 0;
	private _frameSpeed = 0;

	constructor(canvasHeight: number, canvasWidth: number) {
		Controller.getInstance().canvasHeight = canvasHeight;
		Controller.getInstance().canvasWidth = canvasWidth;
		this.step = this.step.bind(this);
		this.drawFrame = this.drawFrame.bind(this);
		this.initAnimationStart = this.initAnimationStart.bind(this);
	}

	private drawFrame(
		context: CanvasRenderingContext2D,
		frameIndex: number,
		columIndex: number,
		rowIndex: number,
		canvasX: number = 0,
		canvasY: number = 0
	) {
		// SpriteImage
		const image = LudeCat.getInstance().spritesheet;
		if (image === null) {
			return;
		}

		const ludeCat = LudeCat.getInstance();
		Controller.getInstance().handleControllerInput();

		const frameWidth = image.width / spriteSheetColumCount;
		const frameHeight = image.height / spriteSheetRowCount;
		context.strokeStyle = '#f00';
		context.lineWidth = 2;
		context.strokeRect(0, 0, context.canvas.width, context.canvas.height);
		context.drawImage(
			image,
			columIndex * frameWidth,
			rowIndex * frameHeight,
			frameWidth,
			frameHeight,
			canvasX + ludeCat.catPosition.x,
			canvasY + ludeCat.catPosition.y,
			frameWidth / scaleOnCanvas,
			frameHeight / scaleOnCanvas
		);
	}

	private step() {
		// Clear canvas

		this._frameSpeed++;
		// yeah this needs to be improved
		if (this._frameSpeed < 4) {
			window.requestAnimationFrame(this.step);
			return;
		}
		this._canvasContext!.clearRect(
			0,
			0,
			this.canvas!.width,
			this.canvas!.height
		);

		this._frameSpeed = 0;
		this.drawFrame(
			this._canvasContext as CanvasRenderingContext2D,
			this._frameIndex,
			this._colIndex,
			this._rowIndex
		);

		// Update Rows or Col Index only
		if (this._colIndex >= 11) {
			this._colIndex = 0;
			this._rowIndex++;
		} else {
			this._colIndex++;
		}
		this._frameIndex++;

		if (this._frameIndex >= frameCount) {
			this._frameIndex = 0;
			this._rowIndex = 0;
			this._colIndex = 0;
		}

		window.requestAnimationFrame(this.step);
	}

	private initAnimationStart() {
		window.requestAnimationFrame(this.step);
	}

	public initialize() {
		if (this.canvas !== null) {
			const context: CanvasRenderingContext2D | null = this.canvas.getContext(
				'2d'
			);

			if (context !== null) {
				this._canvasContext = context;
				AssetLoader.loadAudio();
				AssetLoader.loadImages(this.initAnimationStart);
			} else {
				console.log('CanvasRenderingContext2D is null.');
			}

			Controller.getInstance().controls = CONTROLS.KEYBOARD;
			KeyboardManager.getInstance();
		} else {
			console.log('HTMLCanvasElement is null.');
		}
	}
}
