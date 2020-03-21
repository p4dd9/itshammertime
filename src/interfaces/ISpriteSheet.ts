export default interface ISpriteSheet {
	id: string;
	animated: boolean;
	img: HTMLImageElement;
	spriteSheetColumCount: number;
	spriteSheetRowCount: number;
	scaleOnCanvas: number;
}
