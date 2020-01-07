// Gamepad API (https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API)
// Controller Type: Gamepad connected at index 0: Xbox 360 Controller (XInput STANDARD GAMEPAD). 17 buttons, 4 axes.
// Browser: Version 79.0.3945.88 (Official Build) (64-bit)
// Controller Image: https://commons.wikimedia.org/wiki/File:360_controller.svg

export enum XBOX360_BUTTONS {
	'A' = 0, // Face button
	'B' = 1, // Face button
	'X' = 2, // Face button
	'Y' = 3, // Face button
	'LB' = 4, // Left Bumper
	'RB' = 5, // Right Bumper
	'LT' = 6, // Left Trigger
	'RT' = 7, // Right Trigger
	'BACK' = 8, // Back/Select Button
	'START' = 9, // Start Button
	'LS_PRESS' = 10, // Left Stick Press
	'RS_PRESS' = 11, // Left Stick Press
	'DPAD_UP' = 12, // Directional Pad
	'DPAD_DOWN' = 13, // Directional Pad
	'DPAD_LEFT' = 14, // Directional Pad
	'DPAD_RIGHT' = 15, // Directional Pad
	'GUIDE' = 16, // Guide Button (center)
}

export enum XBOX360_AXIS {
	'LS_X' = 0, // Left Stick X
	'LS_Y' = 1, // Left Stick Y
	'RS_X' = 2, // Right Stick X
	'RS_Y' = 3, // Right Stick Y
}
