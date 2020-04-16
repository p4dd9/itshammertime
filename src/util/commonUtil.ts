export function degToRad(degree: number): number {
	return degree * 0.01745;
}

export function copyTextToClipboard(text: string): void {
	const input = document.createElement('input');
	input.style.position = 'fixed';
	document.body.appendChild(input);
	input.value = text;
	input.focus();
	input.select();
	document.execCommand('copy');
	input.remove();
}

export function supportsGamepads(): boolean {
	return navigator.getGamepads() !== null;
}

export function isScreenSizeSupported(width: number, height: number): boolean {
	if (width < 500 || height < 500) {
		return false;
	}
	return true;
}

export function getRenderingContextsFromDOM(): CanvasRenderingContext2D[] {
	const root: HTMLElement | null = document.getElementById('game-layer');
	const contexts = [];
	const canvases: HTMLCollectionOf<HTMLCanvasElement> = root!.getElementsByTagName(
		'canvas'
	);

	for (let i = 0; i < canvases.length; i++) {
		contexts.push(canvases[i].getContext('2d') as CanvasRenderingContext2D);
	}

	return contexts;
}
