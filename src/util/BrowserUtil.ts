export default class BrowserUtil {
	public static supportsGamepads(): boolean {
		return navigator.getGamepads() !== null;
	}
}
