import Controller from './Controller';

export default class KeyboardManager {
	private static _instance: KeyboardManager;

	private constructor() {
		this.addKeyboardListener();
		this.removeKeyboardListener();
	}

	public static getInstance(): KeyboardManager {
		if (!KeyboardManager._instance) {
			KeyboardManager._instance = new KeyboardManager();
		}

		return KeyboardManager._instance;
	}

	private addKeyboardListener() {
		document.addEventListener('keydown', (e: KeyboardEvent) => {
			Controller.getInstance().handleKeyBoardControls(e.keyCode);
		});
	}
	private removeKeyboardListener() {
		window.removeEventListener('keydown', (e: KeyboardEvent) =>
			Controller.getInstance().handleKeyBoardControls(e.keyCode)
		);
	}
}
