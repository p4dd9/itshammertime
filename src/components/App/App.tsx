import React from 'react';

import GamepadManager from '../GamepadManager';
import AssetLoader from '../AssetLoader';
import BrowserUtil from '../../util/BrowserUtil';
import Controller from '../Controller';
import LudeCat from '../LudeCat';
import {
	spriteSheetSubRetangleWidth,
	spriteSheetSubRetangleHeight,
	frameCount,
} from '../../config/ludeCatConfig';

export default class App extends React.Component<{}, {}> {
	private canvasRef: null | React.RefObject<HTMLCanvasElement> = null;
	private canvasContext: null | CanvasRenderingContext2D = null;

	// Spritesheet Stuff to render
	private frameIndex = 0;
	private rowIndex = 0;
	private colIndex = 0;
	private frameSpeed = 0;

	constructor(props: {}) {
		super(props);
		this.canvasRef = React.createRef();

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
		Controller.handleControllerInput(
			this.canvasRef!.current!.height,
			this.canvasRef!.current!.width
		);
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

		this.frameSpeed++;
		if (this.frameSpeed < 2) {
			window.requestAnimationFrame(this.step);
			return;
		}
		this.canvasContext!.clearRect(
			0,
			0,
			this.canvasRef!.current!.width,
			this.canvasRef!.current!.height
		);

		this.frameSpeed = 0;
		this.drawFrame(
			this.canvasContext as CanvasRenderingContext2D,
			this.frameIndex,
			this.colIndex,
			this.rowIndex
		);

		// Update Rows or Col Index only
		if (this.colIndex >= 11) {
			this.colIndex = 0;
			this.rowIndex++;
		} else {
			this.colIndex++;
		}
		this.frameIndex++;

		if (this.frameIndex >= frameCount) {
			this.frameIndex = 0;
			this.rowIndex = 0;
			this.colIndex = 0;
		}

		window.requestAnimationFrame(this.step);
	}

	private initAnimationStart(images: HTMLImageElement[]) {
		LudeCat.getInstance().spritesheets = images;
		LudeCat.getInstance().spritesheet = images[0];
		window.requestAnimationFrame(this.step);
	}

	public componentDidMount() {
		if (this.canvasRef !== null) {
			const context: CanvasRenderingContext2D | null = (this.canvasRef
				.current as HTMLCanvasElement).getContext('2d');

			window.onload = () => {
				this.canvasRef!.current!.height = window.innerHeight;
				this.canvasRef!.current!.width = window.innerWidth;
			};

			if (context !== null) {
				this.canvasContext = context;
				AssetLoader.loadAudio();
				AssetLoader.loadImages(this.initAnimationStart);
			} else {
				console.log('CanvasRenderingContext2D is null.');
			}

			if (BrowserUtil.supportsGamepads()) {
				console.log('Gamepad API supported! Yey!');
				GamepadManager.getInstance();
			} else {
				console.log('Gamepad API not supported.');
			}
		} else {
			console.log('HTMLCanvasElement is null.');
		}
	}

	public render() {
		return (
			<div>
				<canvas ref={this.canvasRef} id='canvas'></canvas>
			</div>
		);
	}
}
