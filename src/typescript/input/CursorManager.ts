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
		this.start();
	}

	public start(): void {
		this.gameInput.controls = CONTROLS.MOUSE;
		this.context.canvas.addEventListener('mousemove', this.handleMouseMove);
		this.context.canvas.addEventListener('mousedown', this.handleMouseDown);
		this.context.canvas.addEventListener('mouseup', this.handleMouseUp);
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

	public handleMouseMove(): void {
		this.position = this.getMousePos(event as MouseEvent);
	}

	private getMousePos(event: MouseEvent): IPosition {
		const rect = this.context.canvas.getBoundingClientRect();

		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top,
		};
	}

	public handleInput(): void {
		this.weapon.position = this.position;
	}
}
