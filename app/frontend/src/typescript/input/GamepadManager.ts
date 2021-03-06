import Controller from '../Controller';
import CONTROLS from '../../enums/controls';
import IGamepadEvent from '../../interfaces/IGamepadEvent';
import { XBOX360_AXIS, XBOX360_BUTTONS } from '../../enums/xbox360controls';
import Weapon from '../weapon/Weapon';
import Input from '../../interfaces/Input';
import { supportsGamepads } from '../../util/commonUtil';

export default class GamepadManager implements Input {
	private gamepad?: Gamepad | null = null;

	private throttleId: undefined | number = undefined;
	private delay = 95;

	private axesThreshold = 0.3;
	private input: Controller;
	private weapon: Weapon;
	private compatible: boolean;

	constructor(gameInput: Controller, weapon: Weapon) {
		this.weapon = weapon;
		this.input = gameInput;
		this.compatible = supportsGamepads();

		this.handleGamepadConnected = this.handleGamepadConnected.bind(this);
		this.handleGamepadDisconnected = this.handleGamepadDisconnected.bind(this);
	}

	public start(): void {
		if (this.compatible) {
			this.input.hideCursor();
			this.addGamepadConnectListener();
			this.addGamepadDisconnectListener();
		}
	}

	public stop(): void {
		if (this.compatible) {
			this.input.showCursor();
			this.removeGamepadConnectListener();
			this.removeGamepadDisconnectListener();
		}
		clearTimeout(this.throttleId);
	}

	public handleInput(): void {
		this.gamepad = navigator.getGamepads()[0];
		this.handleButtons();
		this.handleAxesInput();
	}

	public handleAxesInput(): void {
		const axes = this.mapGamepadAxes();
		if (axes[XBOX360_AXIS.LS_X] > this.axesThreshold) {
			this.weapon.moveRight();
		}
		if (axes[XBOX360_AXIS.LS_X] < -this.axesThreshold) {
			this.weapon.moveLeft();
		}
		if (axes[XBOX360_AXIS.LS_Y] < -this.axesThreshold) {
			this.weapon.moveUp();
		}
		if (axes[XBOX360_AXIS.LS_Y] > this.axesThreshold) {
			this.weapon.moveDown();
		}
	}

	public handleButtons(): void {
		if (this.gamepad?.buttons[XBOX360_BUTTONS.A].pressed) {
			this.throttle(() => {
				this.weapon.use();
			}, this.delay);
		}
	}

	private mapGamepadAxes(): number[] {
		const gamepadAxes = [];
		for (let i = 0; i < (this.gamepad?.axes.length ?? 0); i++) {
			gamepadAxes.push(Number(this.gamepad?.axes[i].toFixed(2)));
		}
		return gamepadAxes;
	}

	private throttle = (callback: () => void, delay: number): void => {
		if (this.throttleId) {
			return;
		}

		this.throttleId = window.setTimeout(() => {
			callback();
			this.throttleId = undefined;
		}, delay);
	};

	private handleGamepadConnected(event: Event): void {
		this.input.controls = CONTROLS.GAMEPAD;
		this.gamepad = (event as IGamepadEvent).gamepad;
	}

	private handleGamepadDisconnected(): void {
		this.input.controls = CONTROLS.MOUSE;
		delete this.gamepad;
	}

	private addGamepadConnectListener(): void {
		window.addEventListener('gamepadconnected', this.handleGamepadConnected);
	}

	private addGamepadDisconnectListener(): void {
		window.addEventListener('gamepaddisconnected', this.handleGamepadDisconnected);
	}

	private removeGamepadConnectListener(): void {
		window.removeEventListener('gamepadconnected', this.handleGamepadConnected);
	}

	private removeGamepadDisconnectListener(): void {
		window.removeEventListener('gamepaddisconnected', this.handleGamepadDisconnected);
	}
}
