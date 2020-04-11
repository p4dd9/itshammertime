import Controller from '../Controller';
import BrowserUtil from '../../util/BrowserUtil';
import CONTROLS from '../../enums/controls';
import IGamepadEvent from '../../interfaces/IGamepadEvent';
import { XBOX360_AXIS, XBOX360_BUTTONS } from '../../enums/xbox360controls';
import Weapon from '../Weapon';
import Input from '../../interfaces/Input';

export default class GamepadManager implements Input {
	private throttleTimerId: undefined | number = undefined;
	private buttonReadInterval = 90; // time between button input locked to not ready any input

	private _gamepad: Gamepad | null = null;

	// State of the Controll Joystick Axes
	private axesStatus = new Array(4) as number[];

	// State of buttons (TODO: This should be savely removeable)
	private _buttonsStatus = [] as string[];

	// XBOX 360 MAPPING
	private buttons = ['A', 'B', 'X', 'Y'];

	private intervalId = -1;
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
		this.listenToGamepad = this.listenToGamepad.bind(this);

		this.start();
	}

	public get buttonStatus(): string[] {
		return this._buttonsStatus;
	}

	public set buttonStatus(buttonStatus: string[]) {
		this._buttonsStatus = buttonStatus;
	}

	public get gamepad(): Gamepad | null {
		return this._gamepad;
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
		this.handleButtons();
		this.handleAxesInput();
	}

	private listenToGamepad(): void {
		if (this._gamepad === null) {
			return;
		}
		const { buttons, axes } = this._gamepad;

		// Reset everything
		this._buttonsStatus = [];
		const pressed = [];

		// Buttons
		if (buttons) {
			for (
				let buttonIndex = 0, buttnCount = buttons.length;
				buttonIndex < buttnCount;
				buttonIndex++
			) {
				if (buttons[buttonIndex].pressed) {
					pressed.push(this.buttons[buttonIndex]);
				}
			}
		}

		// Axes
		const newAxes = [];
		if (axes) {
			for (let a = 0, x = axes.length; a < x; a++) {
				newAxes.push(axes[a].toFixed(2));
			}
		}

		this.axesStatus = newAxes.map(Number);
		this._buttonsStatus = pressed;
		this._gamepad = navigator.getGamepads()[0];
	}

	private throttleFunction = (callback: () => void, delay: number): void => {
		if (this.throttleTimerId) {
			return;
		}

		this.throttleTimerId = window.setTimeout(() => {
			callback();
			this.throttleTimerId = undefined;
		}, delay);
	};

	public handleAxesInput(): void {
		if (this.axesStatus[XBOX360_AXIS.LS_X] > this.axeStatusThreshold) {
			this.weapon.moveRight();
		}
		if (this.axesStatus[XBOX360_AXIS.LS_X] < -this.axeStatusThreshold) {
			this.weapon.moveLeft();
		}
		if (this.axesStatus[XBOX360_AXIS.LS_Y] < -this.axeStatusThreshold) {
			this.weapon.moveUp();
		}
		if (this.axesStatus[XBOX360_AXIS.LS_Y] > this.axeStatusThreshold) {
			this. weapon.moveDown();
		}
	}

	public handleButtons(): void {
		if (this.gamepad === null || this.gamepad === undefined) {
			return;
		}

		if (this.gamepad.buttons[XBOX360_BUTTONS.A].pressed) {
			this.throttleFunction(() => {
				this.weapon.use();
			}, this.buttonReadInterval);
		}
	}

	private handleGamepadConnected(event: Event): void {
		const gampadEvent = event as IGamepadEvent;
		this.gameInput.controls = CONTROLS.GAMEPAD;

		this.intervalId = window.setInterval(this.listenToGamepad, 100);

		this._gamepad = gampadEvent.gamepad;
		const { index, id, buttons, axes } = gampadEvent.gamepad;
		console.info(
			`Gamepad connected at index ${index}: ${id}. ${buttons.length} buttons, ${axes.length} axes.`
		);
	}

	private handleGamepadDisconnected(event: Event): void {
		const gampadEvent = event as IGamepadEvent;
		clearInterval(this.intervalId);

		this.gameInput.controls = CONTROLS.MOUSE;
		delete this._gamepad;
		const { index, id } = gampadEvent.gamepad;
		console.info(`Gamepad disconnected from index ${index}: ${id}. `);
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
