import IPosition from '../../interfaces/IPosition';
import Weapon from '../Weapon';
import Controller from '../Controller';
import Input from '../../interfaces/Input';
import CONTROLS from '../../enums/controls';

export default class CursorManager implements Input {
	private position: IPosition;
	private context: CanvasRenderingContext2D;
	private gameInput: Controller;
	private weapon: Weapon;
	private mouseDownID: number | undefined;
	private delay = 55;

	constructor(
		gameInput: Controller,
		weapon: Weapon,
		context: CanvasRenderingContext2D
	) {
		this.context = context;

		this.position = {
			x: 0,
			y: 0,
		};

		this.weapon = weapon;
		this.gameInput = gameInput;
		this.mouseDownID = undefined;

		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
	}

	public start(): void {
		this.gameInput.controls = CONTROLS.MOUSE;
		this.context.canvas.addEventListener('mousemove', this.handleMouseMove);
		this.context.canvas.addEventListener('mousedown', this.handleMouseDown);
		this.context.canvas.addEventListener('mouseup', this.handleMouseUp);
		this.context.canvas.addEventListener(
			'mouseleave',
			this.handleMouseLeave
		);
	}

	public stop(): void {
		this.context.canvas.removeEventListener(
			'mousemove',
			this.handleMouseMove
		);

		this.context.canvas.removeEventListener(
			'mousedown',
			this.handleMouseDown
		);

		this.context.canvas.removeEventListener('mouseup', this.handleMouseUp);
		this.context.canvas.removeEventListener(
			'mouseleave',
			this.handleMouseLeave
		);
		clearInterval(this.mouseDownID);
	}

	private handleMouseDown(): void {
		if (this.mouseDownID === undefined) {
			this.mouseDownID = window.setInterval(
				() => this.weapon.use(),
				this.delay
			);
		}
	}

	private handleMouseUp(): void {
		clearInterval(this.mouseDownID);
		this.mouseDownID = undefined;
	}

	private handleMouseLeave(): void {
		clearInterval(this.mouseDownID);
		this.mouseDownID = undefined;
	}

	public handleMouseMove(): void {
		this.position = this.getMousePos(event as MouseEvent);
	}

	private getMousePos(event: MouseEvent): IPosition {
		return {
			x: event.clientX - this.context.canvas.getBoundingClientRect().left,
			y: event.clientY - this.context.canvas.getBoundingClientRect().top,
		};
	}

	public handleInput(): void {
		this.weapon.position = this.position;
	}
}
