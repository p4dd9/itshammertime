import LOCAL_STORAGE from '../config/LOCAL_STORAGE';

export default class LocalStorageUtil {
	public static available(): boolean {
		const test = '__storage_test__';
		try {
			const storage = window.localStorage;
			storage.setItem(test, test);
			storage.removeItem(test);
			return true;
		} catch (e) {
			return false;
		}
	}

	public static setItem(key: string, item: string): void {
		if (LocalStorageUtil.available()) {
			window.localStorage.setItem(key, item);
		}
	}

	public static getItem(key: string): string | null {
		if (LocalStorageUtil.available()) {
			if (LocalStorageUtil.itemExists(key)) {
				return window.localStorage.getItem(key);
			}
		}
		return null;
	}

	public static removeItem(key: string): boolean {
		if (LocalStorageUtil.available()) {
			window.localStorage.removeItem(key);
			return true;
		}
		return false;
	}

	public static clearItems(): void {
		if (LocalStorageUtil.available()) {
			window.localStorage.clear();
		}
	}

	public static itemExists(key: string): boolean | null {
		if (LocalStorageUtil.available()) {
			if (typeof window.localStorage.getItem(key) === 'string') {
				return true;
			} else {
				return false;
			}
		}
		return null;
	}

	public static getVolumeIndex(key: string): number | null {
		if (LocalStorageUtil.available()) {
			if (LocalStorageUtil.itemExists(LOCAL_STORAGE.volumeIndex)) {
				return Number(window.localStorage.getItem(key));
			}
		}
		return null;
	}

	public static initVolume(): number {
		let volumeIndex = LocalStorageUtil.getVolumeIndex(
			LOCAL_STORAGE.volumeIndex
		);

		if (LocalStorageUtil.available()) {
			if (typeof volumeIndex !== 'number') {
				LocalStorageUtil.setItem(LOCAL_STORAGE.volumeIndex, '0');
				volumeIndex = 0;
				return 0;
			} else {
				return volumeIndex;
			}
		}

		volumeIndex = 0;
		return 0;
	}
}
