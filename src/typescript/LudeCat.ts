import GameAudio from './GameAudio';
import AssetLoader from './AssetLoader';

import { ludeCatSpriteSheetAlias } from '../assets/spriteSheetAssets';
import { audioAlias, hammerAudioAssets } from '../assets/audioAssets';

import IPosition from '../interfaces/IPosition';
import IAudio from '../interfaces/IAudio';
import ISpriteSheet from '../interfaces/ISpriteSheet';

import { ludeCatSpriteSheets } from '../assets/spriteSheetAssets';

export default class LudeCat {
	public audio: Map<string, IAudio> | null = null;

	private moveDistance = 5;
	private _moving: string = ludeCatSpriteSheetAlias.IDLE;

	private position: IPosition = {
		x: -150,
		y: 0,
	};

	private delayFrameIndexCount = 0;
	private delayFrameThreshold = 10;

	private frameIndex = 0;
	private rowIndex = 0;
	private colIndex = 0;
	private context: CanvasRenderingContext2D;

	private spritesheet: ISpriteSheet | undefined = undefined;
	private spritesheets: Map<string, ISpriteSheet> | null = null;

	private playIntro = true;

	constructor(context: CanvasRenderingContext2D) {
		this.context = context;

		this.loadAssets();
	}

	public resizeCanvas(canvasWidth: number, canvasHeight: number): void {
		this.context.canvas.height = canvasHeight;
		this.context.canvas.width = canvasWidth;
	}

	private async loadAssets(): Promise<void> {
		const audio = await AssetLoader.loadAudio(hammerAudioAssets);
		const spritesheets = await AssetLoader.loadSpriteSheets(
			ludeCatSpriteSheets
		);

		this.audio = audio;
		this.spritesheets = spritesheets;
		this.spritesheet = spritesheets.get(ludeCatSpriteSheetAlias.IDLE);
	}

	private drawIntro(): void {
		if (
			this.position.x +
				this.spritesheet!.img.width /
					this.spritesheet!.spriteSheetColumCount /
					2 <
			this.context.canvas.width / 2
		) {
			this.moveRight();
		} else {
			this.playIntro = false;
		}
	}

	public draw(): void {
		this.delayFrameIndexCount++;
		if (this.spritesheet === undefined) {
			return;
		}

		if (this.playIntro) {
			this.drawIntro();
		}

		this.drawLudeCat();
		this.updateImageToDraw();
	}

	private drawLudeCat(): void {
		const {
			context: _context,
			colIndex: _colIndex,
			rowIndex: _rowIndex,
			position: _position,
		} = this;
		const spritesheet = this.spritesheet;

		if (spritesheet!.animated === false) {
			_context.drawImage(
				spritesheet!.img,
				0,
				0,
				spritesheet!.img.width,
				spritesheet!.img.height,
				_position.x,
				_position.y,
				spritesheet!.img.width / spritesheet!.scaleOnCanvas,
				spritesheet!.img.height / spritesheet!.scaleOnCanvas
			);
			return;
		}

		const {
			spriteSheetColumCount,
			spriteSheetRowCount,
			scaleOnCanvas,
		} = this.spritesheet!;

		const frameWidth = spritesheet!.img.width / spriteSheetColumCount;
		const frameHeight = spritesheet!.img.height / spriteSheetRowCount;
		_context.drawImage(
			spritesheet!.img,
			_colIndex * frameWidth,
			_rowIndex * frameHeight,
			frameWidth,
			frameHeight,
			_position.x,
			_position.y,
			frameWidth / scaleOnCanvas,
			frameHeight / scaleOnCanvas
		);
	}

	private updateImageToDraw(): void {
		const { delayFrameThreshold: _delayFrameThreshold } = this;
		const frameCount =
			this.spritesheet!.spriteSheetColumCount *
			this.spritesheet!.spriteSheetRowCount;

		if (this.delayFrameIndexCount > _delayFrameThreshold) {
			if (this.colIndex >= 11) {
				this.colIndex = 0;
				this.rowIndex++;
			} else {
				this.colIndex++;
			}

			// Next frame incoming
			this.frameIndex++;

			// Reset frame from spritesheet to the first one
			if (this.frameIndex >= frameCount) {
				this.frameIndex = 0;
				this.rowIndex = 0;
				this.colIndex = 0;
			}

			this.delayFrameIndexCount = 0;
		}
	}

	// MOVEMENT RELATED FUNCTIONS
	public moving(moving: string): void {
		if (this.spritesheets === null) {
			return;
		}

		if (moving !== this._moving) {
			this._moving = moving;
			if (moving) {
				this.spritesheet = this.spritesheets.get(moving);
			} else {
				this.spritesheet = this.spritesheets.get(
					ludeCatSpriteSheetAlias.IDLE
				);
			}
		}
	}

	public moveRight(): void {
		const {
			position: _position,
			spritesheet: _spritesheet,
			moveDistance: moveDistance,
		} = this;
		const canvasWidth = this.context.canvas.width;

		const destinationX =
			_position.x +
			_spritesheet!.img.width / this.spritesheet!.spriteSheetColumCount +
			moveDistance;

		if (destinationX <= canvasWidth) {
			this.moving(ludeCatSpriteSheetAlias.WALK_RIGHT);
			_position.x += moveDistance;
		}
	}

	public moveLeft(): void {
		if (this.playIntro) {
			return;
		}

		const { position: _position, moveDistance: moveDistance } = this;

		const destinationX = _position.x - moveDistance;
		if (destinationX >= 0) {
			this.moving(ludeCatSpriteSheetAlias.WALK_LEFT);
			_position.x += -moveDistance;
		}
	}

	public moveUp(): void {
		if (this.playIntro) {
			return;
		}

		const { position: _position, moveDistance: moveDistance } = this;

		const destinationY = _position.y - moveDistance;

		if (destinationY >= 0) {
			this.moving(ludeCatSpriteSheetAlias.WALK_UP);
			_position.y += -moveDistance;
		}
	}

	public moveDown(): void {
		if (this.playIntro) {
			return;
		}

		const {
			position: _position,
			moveDistance: moveDistance,
			spritesheet: _spritesheet,
		} = this;
		const canvasHeight = this.context.canvas.height;

		const destinationY =
			_position.y +
			_spritesheet!.img.height / this.spritesheet!.spriteSheetRowCount +
			moveDistance;
		if (destinationY < canvasHeight) {
			this.moving(ludeCatSpriteSheetAlias.WALK_DOWN);
			_position.y += moveDistance;
		}
	}

	// AUDIO RELATED FUNCTIONS
	public nya(): void {
		if (this.audio !== null) {
			GameAudio.playSound(this.audio.get(audioAlias.NYA)!.audio);
		}
	}

	public meow(): void {
		if (this.audio !== null) {
			GameAudio.playSound(this.audio.get(audioAlias.MEOW)!.audio);
		}
	}

	public meow2(): void {
		if (this.audio !== null) {
			GameAudio.playSound(this.audio.get(audioAlias.MEOW2)!.audio);
		}
	}
}
