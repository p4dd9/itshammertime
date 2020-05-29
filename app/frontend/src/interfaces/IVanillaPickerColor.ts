export interface IVanillaColor {
	rgba: number[]; // RGBA color components.
	hsla: number[]; //HSLA color components (all values between 0 and 1, inclusive).
	rgbString: string; // RGB CSS value (e.g. rgb(255,215,0)).
	rgbaString: string; // RGBA CSS value (e.g. rgba(255,215,0, .5)).
	hslString: string; // HSL CSS value (e.g. hsl(50.6,100%,50%)).
	hslaString: string; // HSLA CSS value (e.g. hsla(50.6,100%,50%, .5)).
	hex: string; // 8 digit #RRGGBBAA (not supported in all browsers).
}
