import Controller from '../Controller';
import BrowserUtil from '../../util/BrowserUtil';
import CONTROLS from '../../enums/controls';
import IGamepadEvent from '../../interfaces/IGamepadEvent';
import { XBOX360_AXIS, XBOX360_BUTTONS } from '../../enums/xbox360controls';
import Weapon from '../Weapon';
import Input from '../../interfaces/Input';

export default class GamepadManager implements Input {
	private gamepad: Gamepad | null = null;

	private throttleId: undefined | number = undefined;
	private delay = 95;

	private axeStatusThreshold = 0.3;
	private gameInput: Controller;
	private weapon: Weapon;

	constructor(gameInput: Controller, weapon: Weapon) {
		this.weapon = weapon;
		this.gameInput = gameInput;

		this.handleGamepadConnected = this.handleGamepadConnected.bind(this);
		this.handleGamepadDisconnected = this.handleGamepadDisconnected.bind(
			this
		);

		this.start();
	}

	public start(): void {
		if (BrowserUtil.supportsGamepads()) {
			this.addGamepadConnectListener();
			this.addGamepadDisconnectListener();
		}
	}

	public stop(): void {
		if (BrowserUtil.supportsGamepads()) {
			this.removeGamepadConnectListener();
			this.removeGamepadDisconnectListener();
		}
	}

	public handleInput(): void {
		this.gamepad = navigator.getGamepads()[0];
		this.handleButtons();
		this.handleAxesInput();
	}

	public handleAxesInput(): void {
		const axes = this.mapGamepadAxes();
		if (axes[XBOX360_AXIS.LS_X] > this.axeStatusThreshold) {
			this.weapon.moveRight();
		}
		if (axes[XBOX360_AXIS.LS_X] < -this.axeStatusThreshold) {
			this.weapon.moveLeft();
		}
		if (axes[XBOX360_AXIS.LS_Y] < -this.axeStatusThreshold) {
			this.weapon.moveUp();
		}
		if (axes[XBOX360_AXIS.LS_Y] > this.axeStatusThreshold) {
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
		this.gameInput.controls = CONTROLS.GAMEPAD;
		this.gamepad = (event as IGamepadEvent).gamepad;
	}

	private handleGamepadDisconnected(): void {
		this.gameInput.controls = CONTROLS.MOUSE;
		delete this.gamepad;
	}

	private addGamepadConnectListener(): void {
		window.addEventListener(
			'gamepadconnected',
			this.handleGamepadConnected
		);
	}

	private addGamepadDisconnectListener(): void {
		window.addEventListener(
			'gamepaddisconnected',
			this.handleGamepadDisconnected
		);
	}

	private removeGamepadConnectListener(): void {
		window.removeEventListener(
			'gamepadconnected',
			this.handleGamepadConnected
		);
	}

	private removeGamepadDisconnectListener(): void {
		window.removeEventListener(
			'gamepaddisconnected',
			this.handleGamepadDisconnected
		);
	}
}
