import idleBlinktailWhipheadSpriteSheet from '../../assets/spritesheet/idle_blinktailwhiphead.png';

export class Preloader {
	public static loadImages(callback: (images: HTMLImageElement[]) => void) {
		let loadedImageCount: number = 0;
		const images: HTMLImageElement[] = new Array() as HTMLImageElement[];

		const imagePaths: string[] = [idleBlinktailWhipheadSpriteSheet];
		for (const imagePath of imagePaths) {
			const image: HTMLImageElement = new Image();
			image.onload = imageLoaded;
			image.src = imagePath;
			images.push(image);
		}

		function imageLoaded(e: Event) {
			loadedImageCount++;
			if (loadedImageCount >= imagePaths.length) {
				console.log(`All images (${imagePaths.length}) loaded.`);
				callback(images);
			}
		}
	}
}
