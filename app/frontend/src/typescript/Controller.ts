import GamepadManager from './input/GamepadManager';
import CONTROL_TYPE from '../enums/controls';
import Weapon from './Weapon';
import CursorManager from './input/CursorManager';

export default class Controller {
	private cursorLayer = document.getElementById('game-layer') as HTMLCanvasElement;
	private controllerType: CONTROL_TYPE = CONTROL_TYPE.MOUSE;

	private gamepadManager: GamepadManager;
	private cursorManager: CursorManager;

	constructor(weapon: Weapon, context: CanvasRenderingContext2D) {
		this.gamepadManager = new GamepadManager(this, weapon);
		this.cursorManager = new CursorManager(this, weapon, context);
	}

	public set controls(controllerType: CONTROL_TYPE) {
		this.controllerType = controllerType;
	}

	public get controls(): CONTROL_TYPE {
		return this.controllerType;
	}

	public stop(): void {
		this.gamepadManager.stop();
		this.cursorManager.stop();
	}

	public start(): void {
		this.gamepadManager.start();
		this.cursorManager.start();
	}

	public handleInput(): void {
		this.gamepadManager.handleInput();
		this.cursorManager.handleInput();
	}

	public hideCursor(): void {
		this.cursorLayer.classList.add('hide-cursor');
	}

	public showCursor(): void {
		this.cursorLayer.classList.remove('hide-cursor');
	}
}
