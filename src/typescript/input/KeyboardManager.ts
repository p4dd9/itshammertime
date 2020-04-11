import Controller from '../Controller';
import KEYCODES from '../../enums/keycodes';
import Weapon from '../Weapon';
import Input from '../../interfaces/Input';
import CONTROLS from '../../enums/controls';

export default class KeyboardManager implements Input {
	private gameInput: Controller;
	private weapon: Weapon;

	private rightArrowKeyPressed = false;
	private leftArrowKeyPressed = false;
	private upArrowKeyPressed = false;
	private downArrowKeyPressed = false;

	constructor(gameInput: Controller, weapon: Weapon) {
		this.weapon = weapon;
		this.gameInput = gameInput;

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.start();
	}

	public start(): void {
		this.gameInput.controls = CONTROLS.KEYBOARD;
		window.addEventListener('keydown', this.handleKeyDown);
		window.addEventListener('keyup', this.handleKeyUp);
	}

	public stop(): void {
		this.gameInput.controls = CONTROLS.MOUSE;
		window.removeEventListener('keydown', this.handleKeyDown);
		window.removeEventListener('keyup', this.handleKeyUp);
	}

	public handleInput(): void {
		this.handleArrowKeys();
	}

	private handleArrowKeys(): void {
		if (this.rightArrowKeyPressed) {
			this.weapon.moveRight();
		} else if (this.leftArrowKeyPressed) {
			this.weapon.moveLeft();
		} else if (this.upArrowKeyPressed) {
			this.weapon.moveUp();
		} else if (this.downArrowKeyPressed) {
			this.weapon.moveDown();
		}
	}

	private handleKeyUp(event: KeyboardEvent): void {
		this.detectKey(event.keyCode, false);
	}

	private handleKeyDown(event: KeyboardEvent): void {
		this.detectKey(event.keyCode, true);
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
