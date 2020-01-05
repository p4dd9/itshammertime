import React from 'react';

import GamepadManager from '../GamepadManager';
import { Preloader } from './Preloader';

const spriteSheetWidth = 2100;
const spriteSheetHeight = 2400;

const spriteSheetRowCount = 12;
const spriteSheetColumCount = 12;

const moveDistance = 25;

const spriteSheetSubRetangleWidth = spriteSheetWidth / spriteSheetColumCount;
const spriteSheetSubRetangleHeight = spriteSheetHeight / spriteSheetRowCount;

export default class App extends React.Component<{}, {}> {
	private canvasRef: null | React.RefObject<HTMLCanvasElement> = null;
	private canvasContext: null | CanvasRenderingContext2D = null;
	private images: HTMLImageElement[] = new Array() as HTMLImageElement[];
	private gamepadManager: null | GamepadManager = null;

	constructor(props: {}) {
		super(props);
		this.canvasRef = React.createRef();

		this.step = this.step.bind(this);
		this.drawFrame = this.drawFrame.bind(this);
		this.initAnimationStart = this.initAnimationStart.bind(this);
	}

	private x = 0;
	private y = 0;

	private drawFrame(
		context: CanvasRenderingContext2D,
		frameIndex: number,
		columIndex: number,
		rowIndex: number,
		canvasX: number = 0,
		canvasY: number = 0
	) {
		if (this.images[1] === null) {
			return;
		}

		const gamepad = this.gamepadManager;
		if (gamepad!.axesStatus[0] > 0.5) {
			console.log('Left axe: right');
			this.x += moveDistance;
		}
		if (gamepad!.axesStatus[0] < -0.5) {
			console.log('Left axe: left');
			this.x += -moveDistance;
		}
		if (gamepad!.axesStatus[1] > 0.5) {
			console.log('Left axe: down');
			this.y += moveDistance;
		}
		if (gamepad!.axesStatus[1] < -0.5) {
			console.log('Left axe: up');
			this.y += -moveDistance;
		}

		context.drawImage(
			this.images[1],
			columIndex * spriteSheetSubRetangleWidth,
			rowIndex * spriteSheetSubRetangleHeight,
			spriteSheetSubRetangleWidth,
			spriteSheetSubRetangleHeight,
			canvasX + this.x,
			canvasY + this.y,
			spriteSheetSubRetangleWidth,
			spriteSheetSubRetangleHeight
		);
	}

	private frameIndex = 0;
	private frameCount = 144;
	private rowIndex = 0;
	private colIndex = 0;
	private frameSpeed = 0;

	private step() {
		// Clear canvas
		this.frameSpeed++;
		if (this.frameSpeed < 2) {
			window.requestAnimationFrame(this.step);
			return;
		}
		this.canvasContext!.clearRect(0, 0, 750, 900);

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

		if (this.frameIndex >= this.frameCount) {
			this.frameIndex = 0;
			this.rowIndex = 0;
			this.colIndex = 0;
		}

		window.requestAnimationFrame(this.step);
	}

	private supportsGamepads() {
		return !!navigator.getGamepads;
	}

	private initAnimationStart(images: HTMLImageElement[]) {
		this.images = images;
		window.requestAnimationFrame(this.step);
	}

	public componentDidMount() {
		if (this.canvasRef !== null) {
			const context: CanvasRenderingContext2D | null = (this.canvasRef
				.current as HTMLCanvasElement).getContext('2d');

			if (context !== null) {
				this.canvasContext = context;
				Preloader.loadImages(this.initAnimationStart);
			} else {
				console.log('CanvasRenderingContext2D is null.');
			}

			if (this.supportsGamepads()) {
				console.log('Gamepad API supported! Yey!');
				const gamepadManager = new GamepadManager();
				this.gamepadManager = gamepadManager;
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
				<canvas
					ref={this.canvasRef}
					style={{ border: '2px solid black' }}
					height='750px'
					width='900px'
					id='canvas'
				></canvas>
			</div>
		);
	}
}
