import Input from './Input';
import BrowserUtil from '../util/BrowserUtil';
import CONTROLS from '../enums/controls';
import IGamepadEvent from '../interfaces/IGamepadEvent';
import LudeCat from './LudeCat';
import { XBOX360_AXIS, XBOX360_BUTTONS } from '../enums/xbox360controls';
import { ludeCatSpriteSheetAlias } from '../assets/spriteSheetAssets';

export default class GamepadManager {
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
	private ludeCat: LudeCat;

	constructor(gameInput: Input, ludecat: LudeCat) {
		this.ludeCat = ludecat;
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

	public handleAxesInput(): void {
		const {
			axeStatusThreshold: _axeStatusThreshold,
			ludeCat: _ludeCat,
		} = this;
		if (this.axesStatus[XBOX360_AXIS.LS_X] > _axeStatusThreshold) {
			_ludeCat.moveRight();
		}
		if (this.axesStatus[XBOX360_AXIS.LS_X] < -_axeStatusThreshold) {
			_ludeCat.moveLeft();
		}
		if (this.axesStatus[XBOX360_AXIS.LS_Y] < -_axeStatusThreshold) {
			_ludeCat.moveUp();
		}
		if (this.axesStatus[XBOX360_AXIS.LS_Y] > _axeStatusThreshold) {
			_ludeCat.moveDown();
		}
	}

	public handleButtons(): void {
		const { ludeCat: _ludeCat } = this;
		if (this.gamepad!.buttons[XBOX360_BUTTONS.A].pressed) {
			_ludeCat.meow();
		}

		if (this.gamepad!.buttons[XBOX360_BUTTONS.B].pressed) {
			_ludeCat.nya();
		}

		if (this.gamepad!.buttons[XBOX360_BUTTONS.X].pressed) {
			_ludeCat.meow2();
		}
	}

	public checkMovingCharacterByGamepad(): void {
		const {
			ludeCat: _ludeCat,
			axeStatusThreshold: _axeStatusThreshold,
		} = this;

		if (
			!(
				this.axesStatus[XBOX360_AXIS.LS_X] > _axeStatusThreshold ||
				this.axesStatus[XBOX360_AXIS.LS_X] < -_axeStatusThreshold ||
				this.axesStatus[XBOX360_AXIS.LS_Y] > _axeStatusThreshold ||
				this.axesStatus[XBOX360_AXIS.LS_Y] < -_axeStatusThreshold
			)
		) {
			_ludeCat.moving(ludeCatSpriteSheetAlias.IDLE);
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
