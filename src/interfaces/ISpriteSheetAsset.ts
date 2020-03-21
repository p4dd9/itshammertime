export default interface ISpriteSheetAsset {
	id: string;
	src: string;
	animated: boolean;
	spriteSheetColumCount: number;
	spriteSheetRowCount: number;
	scaleOnCanvas: number;
}
