import Input from './Input';
import CONTROLS from '../enums/controls';
import LudeCat from './LudeCat';
import KEYCODES from '../enums/keycodes';
import { ludeCatSpriteSheetAlias } from '../assets/spriteSheetAssets';

export default class KeyboardManager {
	private gameInput: Input;
	private ludeCat: LudeCat;

	private rightArrowKeyPressed = false;
	private leftArrowKeyPressed = false;
	private upArrowKeyPressed = false;
	private downArrowKeyPressed = false;

	constructor(gameInput: Input, ludeCat: LudeCat) {
		this.ludeCat = ludeCat;
		this.gameInput = gameInput;

		this.addKeyboardListenerToDocument();
	}

	public handleArrowKeys(): void {
		const ludeCat = this.ludeCat;

		if (this.rightArrowKeyPressed) {
			ludeCat.moveRight();
		} else if (this.leftArrowKeyPressed) {
			ludeCat.moveLeft();
		} else if (this.upArrowKeyPressed) {
			ludeCat.moveUp();
		} else if (this.downArrowKeyPressed) {
			ludeCat.moveDown();
		} else {
			ludeCat.moving(ludeCatSpriteSheetAlias.IDLE);
		}
	}

	private addKeyboardListenerToDocument(): void {
		document.addEventListener('keydown', (event: KeyboardEvent) => {
			if (this.gameInput.controls === CONTROLS.KEYBOARD) {
				this.detectKey(event.keyCode, true);
			}
		});

		document.addEventListener('keyup', (event: KeyboardEvent) => {
			if (this.gameInput.controls === CONTROLS.KEYBOARD) {
				this.detectKey(event.keyCode, false);
			}
		});
	}

	private detectKey(keyCode: number, pressed: boolean): void {
		const ludeCat = this.ludeCat;

		if (keyCode === KEYCODES.RIGHT_ARROW || keyCode === KEYCODES.RIGHT_D) {
			this.rightArrowKeyPressed = pressed;
		} else if (
			keyCode === KEYCODES.LEFT_ARROW ||
			keyCode === KEYCODES.LEFT_A
		) {
			this.leftArrowKeyPressed = pressed;
		} else if (keyCode === KEYCODES.UP_ARROW || keyCode === KEYCODES.UP_W) {
			this.upArrowKeyPressed = pressed;
		} else if (
			keyCode === KEYCODES.DOWN_ARROW ||
			keyCode === KEYCODES.DOWN_S
		) {
			this.downArrowKeyPressed = pressed;
		} else if (keyCode === KEYCODES.SPACE) {
			ludeCat.meow();
		}
	}
}
