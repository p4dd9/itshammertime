import GameInput from './GameInput';
import CONTROLS from '../enums/controls';
import LudeCat from './LudeCat';
import LUDECATSTATE from '../enums/ludecatstate';
import KEYCODES from '../enums/keycodes';

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
			this._ludeCat.moving(LUDECATSTATE.IDLE);
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
		if (keyCode === KEYCODES.RIGHT_ARROW) {
			this._rightArrowKeyPressed = pressed;
		} else if (keyCode === KEYCODES.LEFT_ARROW) {
			this._leftArrowKeyPressed = pressed;
		} else if (keyCode === KEYCODES.UP_ARROW) {
			this._upArrowKeyPressed = pressed;
		} else if (keyCode === KEYCODES.DOWN_ARROW) {
			this._downArrowKeyPressed = pressed;
		}
	}
}