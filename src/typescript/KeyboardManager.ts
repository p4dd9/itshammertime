import Controller from './Controller';

export default class KeyboardManager {
	public addKeyboardListener() {
		document.addEventListener('keydown', (e: KeyboardEvent) => {
			Controller.getInstance().handleKeyBoardControls(e.keyCode);
		});
	}
}
