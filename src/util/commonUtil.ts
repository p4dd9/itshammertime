export function degToRad(degree: number): number {
	return degree * 0.01745;
}

export function copyTextToClipboard(
	event: MouseEvent,
	text = 'pat.obermueller@gmail.com'
): void {
	const input = document.createElement('input');
	input.style.position = 'fixed';
	document.body.appendChild(input);
	input.value = text;
	input.focus();
	input.select();
	document.execCommand('copy');
	input.remove();
}
