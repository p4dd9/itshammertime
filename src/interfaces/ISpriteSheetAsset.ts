export default interface ISpriteSheetAsset {
	id: string;
	animated: boolean;
	src: string;
	spriteSheetColumCount: number;
	spriteSheetRowCount: number;
	scaleOnCanvas: number;
}
