import Input from '../Input';
import KEYCODES from '../../enums/keycodes';
import Weapon from '../Weapon';

export default class KeyboardManager {
	private gameInput: Input;
	private weapon: Weapon;

	private rightArrowKeyPressed = false;
	private leftArrowKeyPressed = false;
	private upArrowKeyPressed = false;
	private downArrowKeyPressed = false;

	constructor(gameInput: Input, weapon: Weapon) {
		this.weapon = weapon;
		this.gameInput = gameInput;

		console.log(this.gameInput);
		this.addKeyboardListenerToDocument();
	}

	public handleArrowKeys(): void {
		const weapon = this.weapon;

		if (this.rightArrowKeyPressed) {
			weapon.moveRight();
		} else if (this.leftArrowKeyPressed) {
			weapon.moveLeft();
		} else if (this.upArrowKeyPressed) {
			weapon.moveUp();
		} else if (this.downArrowKeyPressed) {
			weapon.moveDown();
		}
	}

	private addKeyboardListenerToDocument(): void {
		document.addEventListener('keydown', (event: KeyboardEvent) => {
			this.detectKey(event.keyCode, true);
		});

		document.addEventListener('keyup', (event: KeyboardEvent) => {
			this.detectKey(event.keyCode, false);
		});
	}

	private detectKey(keyCode: number, pressed: boolean): void {
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
		}
		if (keyCode === KEYCODES.SPACE) {
			this.weapon.use();
		}
	}
}
