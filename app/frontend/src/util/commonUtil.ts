import IDisplayResolution from '../interfaces/IDisplayResolution';

export function degToRad(degree: number): number {
	return degree * 0.01745;
}

export function getRandomInt(max = 1): number {
	return Math.floor(Math.random() * max);
}

export function clickedOutSide(element: HTMLElement, event: MouseEvent): boolean {
	return !element.contains(event.target as Node);
}

export function isIE(): boolean {
	const ua = window.navigator.userAgent;
	const msie = ua.indexOf('MSIE ');

	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv:11\./)) {
		return true;
	} else {
		return false;
	}
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

export function onSuccessfulClassicPlantHammerTransaction(): void {
	document
		.getElementById('ui-button-use-bits-plant-wrapper')
		?.classList.add('usedBitsPogChampEmote');
	(document.getElementById('ui-shop-preview-green') as HTMLElement).style.filter = 'none';
	document
		.getElementById('ui-shop-classic-plant-page-cheer-anchor')
		?.classList.add('whirlOutUsedBitsButton');
}

export function supportsGamepads(): boolean {
	return navigator.getGamepads() !== null;
}

export function isScreenSizeSupported(width: number, height: number): boolean {
	if (width < 451 || height < 301) {
		return false;
	}
	return true;
}

export function getDisplayResolution(displayResolution: string): IDisplayResolution {
	const split = displayResolution.split('x');
	return {
		width: Number(split[0]),
		height: Number(split[1]),
	};
}

export function create2DRenderingContexts(): CanvasRenderingContext2D[] {
	const root: HTMLElement = document.getElementById('game-layer') as HTMLElement;
	const { innerHeight, innerWidth } = window;

	const contexts = [];

	for (let i = 0; i < 3; i++) {
		const canvas = document.createElement('canvas');
		canvas.width = innerHeight;
		canvas.height = innerWidth;
		canvas.id = `layer-${i}`;
		canvas.style.position = 'absolute';
		contexts.push(root.appendChild(canvas).getContext('2d') as CanvasRenderingContext2D);
	}

	return contexts;
}
