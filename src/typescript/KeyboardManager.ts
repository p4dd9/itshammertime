import Input from './Input';
import CONTROLS from '../enums/controls';
import LudeCat from './LudeCat';
import KEYCODES from '../enums/keycodes';
import { spriteSheetAlias } from '../assets/spriteSheetAssets';

export default class KeyboardManager {
	private _gameInput: Input;
	private _ludeCat: LudeCat;

	private _rightArrowKeyPressed = false;
	private _leftArrowKeyPressed = false;
	private _upArrowKeyPressed = false;
	private _downArrowKeyPressed = false;

	constructor(gameInput: Input, ludeCat: LudeCat) {
		this._ludeCat = ludeCat;
		this._gameInput = gameInput;

		this.addKeyboardListenerToDocument();
	}

	public handleArrowKeys(): void {
		if (this._rightArrowKeyPressed) {
			this._ludeCat.moveRight();
		} else if (this._leftArrowKeyPressed) {
			this._ludeCat.moveLeft();
		} else if (this._upArrowKeyPressed) {
			this._ludeCat.moveUp();
		} else if (this._downArrowKeyPressed) {
			this._ludeCat.moveDown();
		} else {
			this._ludeCat.moving(spriteSheetAlias.IDLE);
		}
	}

	private addKeyboardListenerToDocument(): void {
		document.addEventListener('keydown', (e: KeyboardEvent) => {
			if (this._gameInput.controls === CONTROLS.KEYBOARD) {
				this.detectKey(e.keyCode, true);
			}
		});

		document.addEventListener('keyup', (e: KeyboardEvent) => {
			if (this._gameInput.controls === CONTROLS.KEYBOARD) {
				this.detectKey(e.keyCode, false);
			}
		});
	}

	private detectKey(keyCode: number, pressed: boolean): void {
		const ludeCat = this._ludeCat;

		if (keyCode === KEYCODES.RIGHT_ARROW || keyCode === KEYCODES.RIGHT_D) {
			this._rightArrowKeyPressed = pressed;
		} else if (
			keyCode === KEYCODES.LEFT_ARROW ||
			keyCode === KEYCODES.LEFT_A
		) {
			this._leftArrowKeyPressed = pressed;
		} else if (keyCode === KEYCODES.UP_ARROW || keyCode === KEYCODES.UP_W) {
			this._upArrowKeyPressed = pressed;
		} else if (
			keyCode === KEYCODES.DOWN_ARROW ||
			keyCode === KEYCODES.DOWN_S
		) {
			this._downArrowKeyPressed = pressed;
		} else if (keyCode === KEYCODES.SPACE) {
			ludeCat.meow();
		}
	}
}
