import GameInput from './GameInput';
import CONTROLS from '../enums/controls';
import LudeCat from './LudeCat';
import KEYCODES from '../enums/keycodes';
import { spriteSheetAlias } from '../assets/spriteSheetAssets';

export default class KeyboardManager {
	private _gameInput: GameInput;
	private _ludeCat: LudeCat;

	// Keyboard
	private _rightArrowKeyPressed = false;
	private _leftArrowKeyPressed = false;
	private _upArrowKeyPressed = false;
	private _downArrowKeyPressed = false;

	constructor(gameInput: GameInput, ludeCat: LudeCat) {
		this.addKeyboardListenerToDocument();
		this._ludeCat = ludeCat;
		this._gameInput = gameInput;
	}

	public handleArrowKeys() {
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

	private addKeyboardListenerToDocument() {
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

	private detectKey(keyCode: number, pressed: boolean) {
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
