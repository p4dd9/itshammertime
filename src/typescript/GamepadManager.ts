import Controller from './Controller';
import BrowserUtil from '../util/BrowserUtil';
import CONTROLS from '../enums/controls';

export default class GamepadManager {
	// The actualy gamepad from the browser API
	private _gamepad: null | Gamepad = null;

	// XBOX 360 MAPPING
	private _buttons = ['A', 'B', 'X', 'Y'];

	// State of the Controll Joystick Axes
	private _axesStatus: number[] = new Array(4) as number[];

	// State of buttons
	private _buttonsStatus: string[] = new Array() as string[];

	public intervalId: number = -1;

	private _controller: Controller;

	constructor(controller: Controller) {
		this.listenToGamepad = this.listenToGamepad.bind(this);
		this.gamepadConntectedListener();
		this.gamepadDisconnectedListener();
		this._controller = controller;
	}

	public get axesStatus(): number[] {
		return this._axesStatus;
	}

	public set axesStatus(axesStatus: number[]) {
		this._axesStatus = axesStatus;
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

	private listenToGamepad() {
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
					pressed.push(this._buttons[buttonIndex]);
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

		this._axesStatus = newAxes.map(Number);
		this._buttonsStatus = pressed;
		this._gamepad = navigator.getGamepads()[0];
	}

	private gamepadConntectedListener() {
		if (BrowserUtil.supportsGamepads()) {
			window.addEventListener('gamepadconnected', (e: any) => {
				this._controller.controls = CONTROLS.GAMEPAD;
				this.intervalId = window.setInterval(this.listenToGamepad, 100);
				this._gamepad = e.gamepad;
				const { index, id, buttons, axes } = e.gamepad;
				console.log(
					`Gamepad connected at index ${index}: ${id}. ${buttons.length} buttons, ${axes.length} axes.`
				);
			});
		}
	}

	private gamepadDisconnectedListener() {
		if (BrowserUtil.supportsGamepads()) {
			window.addEventListener('gamepaddisconnected', (e: any) => {
				clearInterval(this.intervalId);
				this._controller.controls = CONTROLS.KEYBOARD;
				delete this._gamepad;
				const { index, id } = e.gamepad;
				console.log(
					`Gamepad disconnected from index ${index}: ${id}. `
				);
			});
		}
	}
}
