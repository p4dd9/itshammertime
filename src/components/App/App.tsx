import React from 'react';

import AssetLoader from '../AssetLoader';
import Controller from '../Controller';
import LudeCat from '../LudeCat';
import {
	spriteSheetSubRetangleWidth,
	spriteSheetSubRetangleHeight,
	frameCount,
} from '../../config/ludeCatConfig';
import CONTROLS from '../../enums/controls';
import KeyboardManager from '../KeyboardManager';

export default class App extends React.Component<{}, {}> {
	private _canvasRef: null | React.RefObject<HTMLCanvasElement> = null;
	private _canvasContext: null | CanvasRenderingContext2D = null;

	// Spritesheet Stuff to render
	private _frameIndex = 0;
	private _rowIndex = 0;
	private _colIndex = 0;
	private _frameSpeed = 0;

	constructor(props: {}) {
		super(props);
		this._canvasRef = React.createRef();

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
		context.drawImage(
			image,
			columIndex * spriteSheetSubRetangleWidth,
			rowIndex * spriteSheetSubRetangleHeight,
			spriteSheetSubRetangleWidth,
			spriteSheetSubRetangleHeight,
			canvasX + ludeCat.catPosition.x,
			canvasY + ludeCat.catPosition.y,
			spriteSheetSubRetangleWidth,
			spriteSheetSubRetangleHeight
		);
	}

	private step() {
		// Clear canvas

		this._frameSpeed++;
		// yeah this needs to be improved
		if (this._frameSpeed < 1) {
			window.requestAnimationFrame(this.step);
			return;
		}
		this._canvasContext!.clearRect(
			0,
			0,
			this._canvasRef!.current!.width,
			this._canvasRef!.current!.height
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

	private initAnimationStart(images: HTMLImageElement[]) {
		LudeCat.getInstance().spritesheets = images;
		LudeCat.getInstance().spritesheet = images[0];
		window.requestAnimationFrame(this.step);
	}

	public componentDidMount() {
		if (this._canvasRef !== null) {
			const context: CanvasRenderingContext2D | null = (this._canvasRef
				.current as HTMLCanvasElement).getContext('2d');

			window.onload = () => {
				this._canvasRef!.current!.height = window.innerHeight;
				this._canvasRef!.current!.width = window.innerWidth;
				Controller.getInstance().canvasHeight = window.innerHeight;
				Controller.getInstance().canvasWidth = window.innerWidth;
			};

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

	public render() {
		return (
			<div>
				<canvas ref={this._canvasRef} id='canvas'></canvas>
			</div>
		);
	}
}
