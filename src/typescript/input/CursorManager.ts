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

		this.updatePosition = this.updatePosition.bind(this);
		this.start();
	}

	public start(): void {
		this.gameInput.controls = CONTROLS.MOUSE;
		this.context.canvas.addEventListener('mousemove', this.updatePosition);
	}

	public stop(): void {
		this.context.canvas.removeEventListener(
			'mousemove',
			this.updatePosition
		);
	}

	private getMousePos(event: MouseEvent): IPosition {
		const rect = this.context.canvas.getBoundingClientRect();

		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top,
		};
	}

	public updatePosition(): void {
		this.position = this.getMousePos(event as MouseEvent);
	}

	get mousePosition(): IPosition {
		return this.position;
	}

	set mousePosition(position: IPosition) {
		this.position = position;
	}

	public handleInput(): void {
		this.weapon.position = this.position;
	}
}
