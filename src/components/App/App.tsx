import React from 'react';

import idleBlinktailWhipheadSpriteSheet from '../../assets/spritesheet/idle_blinktailwhiphead.png';

const spriteSheetWidth = 2100;
const spriteSheetHeight = 2400;

const spriteSheetRowCount = 12;
const spriteSheetColumCount = 12;

// const scaleSpriteSheetSubRectangleCount = 1;

const spriteSheetSubRetangleWidth = spriteSheetWidth / spriteSheetColumCount;
const spriteSheetSubRetangleHeight = spriteSheetHeight / spriteSheetRowCount;

export default class App extends React.Component<{}, {}> {
	private canvasRef: null | React.RefObject<HTMLCanvasElement> = null;
	private canvasContext: null | CanvasRenderingContext2D = null;
	private img: null | HTMLImageElement = null;

	constructor(props: {}) {
		super(props);
		this.canvasRef = React.createRef();

		this.step = this.step.bind(this);
		this.drawFrame = this.drawFrame.bind(this);
	}

	private drawFrame(
		context: CanvasRenderingContext2D,
		frameIndex: number,
		columIndex: number,
		rowIndex: number,
		canvasX: number = 0,
		canvasY: number = 0
	) {
		if (this.img === null) {
			return;
		}

		context.drawImage(
			this.img,
			columIndex * spriteSheetSubRetangleWidth,
			rowIndex * spriteSheetSubRetangleHeight,
			spriteSheetSubRetangleWidth,
			spriteSheetSubRetangleHeight,
			canvasX,
			canvasY,
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

	public componentDidMount() {
		const canvas: HTMLElement | null = document.getElementById('canvas');
		if (canvas !== null) {
			const context: CanvasRenderingContext2D | null = (this.canvasRef
				?.current as HTMLCanvasElement).getContext('2d');

			if (context !== null) {
				this.canvasContext = context;
				const img = new Image();
				img.src = idleBlinktailWhipheadSpriteSheet;
				img.onload = () => {
					this.img = img;

					// Animationstart
					window.requestAnimationFrame(this.step);
				};
			}
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
