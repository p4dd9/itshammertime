import GameAudio from './GameAudio';
import AssetLoader from './AssetLoader';

import { spriteSheetAlias } from '../assets/spriteSheetAssets';
import { audioAlias, hammerAudioAssets } from '../assets/audioAssets';

import IPosition from '../interfaces/IPosition';
import IAudio from '../interfaces/IAudio';
import ISpriteSheet from '../interfaces/ISpriteSheet';

import { spriteSheetAssets } from '../assets/spriteSheetAssets';

export default class LudeCat {
	public audio: Map<string, IAudio> | null = null;

	private _moveDistance = 5;
	private _moving: string = spriteSheetAlias.IDLE;
	private _position: IPosition = {
		x: -150,
		y: 0,
	};

	private _delayFrameIndexCount = 0;
	private _delayFrameThreshold = 10;

	private _frameIndex = 0;
	private _rowIndex = 0;
	private _colIndex = 0;
	private _context: CanvasRenderingContext2D;

	private _spritesheet: ISpriteSheet | undefined = undefined;
	private _spritesheets: Map<string, ISpriteSheet> | null = null;

	private _playIntro = true;

	constructor(context: CanvasRenderingContext2D) {
		this._context = context;

		this.loadAssets();
	}

	public resizeCanvas(canvasWidth: number, canvasHeight: number): void {
		this._context.canvas.height = canvasHeight;
		this._context.canvas.width = canvasWidth;
	}

	private async loadAssets(): Promise<void> {
		const audio = await AssetLoader.loadAudio(hammerAudioAssets);
		const spritesheets = await AssetLoader.loadSpriteSheets(
			spriteSheetAssets
		);

		this.audio = audio;
		this._spritesheets = spritesheets;
		this._spritesheet = spritesheets.get(spriteSheetAlias.IDLE);
	}

	private playIntro(): void {
		if (
			this._position.x +
				this._spritesheet!.img.width /
					this._spritesheet!.spriteSheetColumCount /
					2 <
			this._context.canvas.width / 2
		) {
			this.moveRight();
		} else {
			this._playIntro = false;
		}
	}

	public draw(): void {
		this._delayFrameIndexCount++;
		if (this._spritesheet === undefined) {
			return;
		}

		if (this._playIntro) {
			this.playIntro();
		}

		this.drawLudeCat();
		this.updateImageToDraw();
	}

	private drawLudeCat(): void {
		const { _context, _colIndex, _rowIndex, _position } = this;
		const spritesheet = this._spritesheet;

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
		} = this._spritesheet!;

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
		const { _delayFrameThreshold } = this;
		const frameCount =
			this._spritesheet!.spriteSheetColumCount *
			this._spritesheet!.spriteSheetRowCount;

		if (this._delayFrameIndexCount > _delayFrameThreshold) {
			if (this._colIndex >= 11) {
				this._colIndex = 0;
				this._rowIndex++;
			} else {
				this._colIndex++;
			}

			// Next frame incoming
			this._frameIndex++;

			// Reset frame from spritesheet to the first one
			if (this._frameIndex >= frameCount) {
				this._frameIndex = 0;
				this._rowIndex = 0;
				this._colIndex = 0;
			}

			this._delayFrameIndexCount = 0;
		}
	}

	// MOVEMENT RELATED FUNCTIONS
	public moving(moving: string): void {
		if (this._spritesheets === null) {
			return;
		}

		if (moving !== this._moving) {
			this._moving = moving;
			if (moving) {
				this._spritesheet = this._spritesheets.get(moving);
			} else {
				this._spritesheet = this._spritesheets.get(
					spriteSheetAlias.IDLE
				);
			}
		}
	}

	public moveRight(): void {
		const { _position, _spritesheet, _moveDistance: moveDistance } = this;
		const canvasWidth = this._context.canvas.width;

		const destinationX =
			_position.x +
			_spritesheet!.img.width / this._spritesheet!.spriteSheetColumCount +
			moveDistance;

		if (destinationX <= canvasWidth) {
			this.moving(spriteSheetAlias.WALK_RIGHT);
			_position.x += moveDistance;
		}
	}

	public moveLeft(): void {
		if (this._playIntro) {
			return;
		}

		const { _position, _moveDistance: moveDistance } = this;

		const destinationX = _position.x - moveDistance;
		if (destinationX >= 0) {
			this.moving(spriteSheetAlias.WALK_LEFT);
			_position.x += -moveDistance;
		}
	}

	public moveUp(): void {
		if (this._playIntro) {
			return;
		}

		const { _position, _moveDistance: moveDistance } = this;

		const destinationY = _position.y - moveDistance;

		if (destinationY >= 0) {
			this.moving(spriteSheetAlias.WALK_UP);
			_position.y += -moveDistance;
		}
	}

	public moveDown(): void {
		if (this._playIntro) {
			return;
		}

		const { _position, _moveDistance: moveDistance, _spritesheet } = this;
		const canvasHeight = this._context.canvas.height;

		const destinationY =
			_position.y +
			_spritesheet!.img.height / this._spritesheet!.spriteSheetRowCount +
			moveDistance;
		if (destinationY < canvasHeight) {
			this.moving(spriteSheetAlias.WALK_DOWN);
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
