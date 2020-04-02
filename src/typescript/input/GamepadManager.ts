import Input from '../Input';
import BrowserUtil from '../../util/BrowserUtil';
import CONTROLS from '../../enums/controls';
import IGamepadEvent from '../../interfaces/IGamepadEvent';
import { XBOX360_AXIS, XBOX360_BUTTONS } from '../../enums/xbox360controls';
import Weapon from '../Weapon';

export default class GamepadManager {
	private throttleTimerId: undefined | number = undefined;

	private _gamepad: Gamepad | null = null;

	// State of the Controll Joystick Axes
	private _axesStatus: number[] = new Array(4) as number[];

	// State of buttons
	private _buttonsStatus: string[] = [] as string[];

	// XBOX 360 MAPPING
	private buttons = ['A', 'B', 'X', 'Y'];

	private intervalId = -1;
	private axeStatusThreshold = 0.3;
	private gameInput: Input;
	private weapon: Weapon;

	constructor(gameInput: Input, weapon: Weapon) {
		this.weapon = weapon;
		this.gameInput = gameInput;

		this.gamepadConntectedListener();
		this.gamepadDisconnectedListener();

		this.listenToGamepad = this.listenToGamepad.bind(this);
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

		this._axesStatus = newAxes.map(Number);
		this._buttonsStatus = pressed;
		this._gamepad = navigator.getGamepads()[0];
	}

	private throttleFunction = (func: () => void, delay: number): void => {
		if (this.throttleTimerId) {
			return;
		}

		this.throttleTimerId = window.setTimeout(() => {
			func();
			this.throttleTimerId = undefined;
		}, delay);
	};

	public handleAxesInput(): void {
		const { axeStatusThreshold, weapon: ludeCat } = this;
		if (this.axesStatus[XBOX360_AXIS.LS_X] > axeStatusThreshold) {
			ludeCat.moveRight();
		}
		if (this.axesStatus[XBOX360_AXIS.LS_X] < -axeStatusThreshold) {
			ludeCat.moveLeft();
		}
		if (this.axesStatus[XBOX360_AXIS.LS_Y] < -axeStatusThreshold) {
			ludeCat.moveUp();
		}
		if (this.axesStatus[XBOX360_AXIS.LS_Y] > axeStatusThreshold) {
			ludeCat.moveDown();
		}
	}

	public handleButtons(): void {
		const { weapon, gamepad } = this;

		if (gamepad === null) {
			return;
		}

		if (gamepad.buttons[XBOX360_BUTTONS.A].pressed) {
			this.throttleFunction(() => {
				weapon.use();
			}, 90);
		}
	}

	public checkMovingCharacterByGamepad(): void {
		const { axeStatusThreshold, axesStatus } = this;

		if (
			!(
				axesStatus[XBOX360_AXIS.LS_X] > axeStatusThreshold ||
				axesStatus[XBOX360_AXIS.LS_X] < -axeStatusThreshold ||
				axesStatus[XBOX360_AXIS.LS_Y] > axeStatusThreshold ||
				axesStatus[XBOX360_AXIS.LS_Y] < -axeStatusThreshold
			)
		) {
			console.log('I like to move it move it');
		}
	}

	private gamepadConntectedListener(): void {
		if (BrowserUtil.supportsGamepads()) {
			window.addEventListener('gamepadconnected', (event: Event) => {
				const gampadEvent = event as IGamepadEvent;
				this.gameInput.controls = CONTROLS.GAMEPAD;

				this.intervalId = window.setInterval(this.listenToGamepad, 100);

				this._gamepad = gampadEvent.gamepad;
				const { index, id, buttons, axes } = gampadEvent.gamepad;
				console.info(
					`Gamepad connected at index ${index}: ${id}. ${buttons.length} buttons, ${axes.length} axes.`
				);
			});
		}
	}

	private gamepadDisconnectedListener(): void {
		if (BrowserUtil.supportsGamepads()) {
			window.addEventListener('gamepaddisconnected', (event: Event) => {
				const gampadEvent = event as IGamepadEvent;
				clearInterval(this.intervalId);
				this.gameInput.controls = CONTROLS.KEYBOARD;
				delete this._gamepad;
				const { index, id } = gampadEvent.gamepad;
				console.info(
					`Gamepad disconnected from index ${index}: ${id}. `
				);
			});
		}
	}
}
