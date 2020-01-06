export default class BrowserUtil {
	public static supportsGamepads() {
		return navigator.getGamepads() !== null;
	}
}
