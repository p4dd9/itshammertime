import IPosition from '../interfaces/IPosition';
import Weapon from './Weapon';
import Input from './Input';

export default class CursorManager {
	private position: IPosition;
	private context: CanvasRenderingContext2D;
	private gameInput: Input;
	private weapon: Weapon;

	constructor(
		gameInput: Input,
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

		console.log(this.gameInput);
		this.addCursorListenerToDocument();
	}

	get mousePosition(): IPosition {
		return this.position;
	}

	set mousePosition(position: IPosition) {
		this.position = position;
	}

	public handleMouse(): void {
		this.weapon.position = this.position;
	}

	private getMousePos(event: MouseEvent): IPosition {
		const rect = this.context.canvas.getBoundingClientRect();

		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top,
		};
	}

	private addCursorListenerToDocument(): void {
		this.context.canvas.addEventListener('mousemove', (event) => {
			this.position = this.getMousePos(event as MouseEvent);
		});
	}
}
