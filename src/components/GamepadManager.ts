// Inspired by https://gist.github.com/vankasteelj/50b59c61dd04ff27f5bbb59746c21ad1

export default class GamepadManager {
	private controller: Gamepad | null = null;
	private buttonsCache = new Array() as number[];
	private buttons = [
		'DPad-Up',
		'DPad-Down',
		'DPad-Left',
		'DPad-Right',
		'Start',
		'Back',
		'Axis-Left',
		'Axis-Right',
		'LB',
		'RB',
		'Power',
		'A',
		'B',
		'X',
		'Y',
	];

	public axesStatus: any = [];
	private buttonsStatus: any = [];

	constructor() {
		this.gamepadConntectedListener();
		this.gamepadDisconnectedListener();
		this.listenToGamepad = this.listenToGamepad.bind(this);
		this.buttonPressed = this.buttonPressed.bind(this);
		setInterval(this.listenToGamepad, 100);
	}

	private buttonPressed(button: any, hold?: any) {
		let newPress = false;
		// loop through pressed buttons
		for (let i = 0, s = this.buttonsStatus.length; i < s; i++) {
			// if we found the button we're looking for...
			if (this.buttonsStatus[i] === button) {
				// set the boolean variable to true
				newPress = true;
				// if we want to check the single press
				if (!hold) {
					// loop through the cached states from the previous frame
					for (let j = 0, p = this.buttonsCache.length; j < p; j++) {
						// if the button was already pressed, ignore new press
						if (this.buttonsCache[j] === button) {
							newPress = false;
						}
					}
				}
			}
		}
		return newPress;
	}

	private listenToGamepad() {
		this.buttonsCache = [];
		for (
			let buttonCacheIndex = 0;
			buttonCacheIndex < this.buttonsStatus.length;
			buttonCacheIndex++
		) {
			this.buttonsCache[buttonCacheIndex] = this.buttonsStatus[
				buttonCacheIndex
			];
		}
		this.buttonsStatus = [];
		if (this.controller === null) {
			return;
		}
		const { buttons, axes } = this.controller;

		const pressed = [];
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

		const newAxes = [];
		if (axes) {
			for (let a = 0, x = axes.length; a < x; a++) {
				newAxes.push(axes[a].toFixed(2));
			}
		}

		this.axesStatus = newAxes;
		this.buttonsStatus = pressed;

		this.controller = navigator.getGamepads()[0];
	}

	private gamepadConntectedListener() {
		const that = this;

		window.addEventListener('gamepadconnected', (e: any) => {
			that.controller = e.gamepad;
			console.log(
				'Gamepad connected at index %d: %s. %d buttons, %d axes.',
				e.gamepad.index,
				e.gamepad.id,
				e.gamepad.buttons.length,
				e.gamepad.axes.length
			);
		});
	}
	private gamepadDisconnectedListener() {
		window.addEventListener('gamepaddisconnected', (e: any) => {
			delete this.controller;
			console.log(
				'Gamepad disconnected from index %d: %s',
				e.gamepad.index,
				e.gamepad.id
			);
		});
	}

	public getGamepad() {
		return this.controller;
	}
}
