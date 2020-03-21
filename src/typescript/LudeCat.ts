import IPosition from '../interfaces/IPosition';
import ANIMATION from '../enums/spritesheets';
import LUDECATSTATE from '../enums/ludecatstate';
import AssetLoader from './AssetLoader';
import AudioManager from './AudioManager';
import AUDIO from '../enums/audio';
import ISpriteSheet from '../interfaces/ISpriteSheet';

export default class LudeCat {
	private _moveDistance = 5;
	private _moving: LUDECATSTATE = LUDECATSTATE.IDLE;
	private _position: IPosition = {
		x: -150,
		y: 0,
	};

	private _delayFrameIndexCount = 0;
	private _delayFrameThreshold = 2;

	private _frameIndex = 0;
	private _rowIndex = 0;
	private _colIndex = 0;
	private _context: CanvasRenderingContext2D;

	private _spritesheet: ISpriteSheet | null = null;
	private _spritesheets: ISpriteSheet[] | null = null;
	private _audio: HTMLAudioElement[] | null = null;

	private _playIntro = true;

	constructor(context: CanvasRenderingContext2D) {
		this._context = context;

		this.loadAssets();
	}

	public resizeCanvas(canvasWidth: number, canvasHeight: number) {
		this._context.canvas.height = canvasHeight;
		this._context.canvas.width = canvasWidth;
	}

	private async loadAssets() {
		const audio = await AssetLoader.loadAudio();
		const spritesheets = await AssetLoader.loadSpriteSheets();

		this._audio = audio;
		this._spritesheets = spritesheets;
		this._spritesheet = spritesheets[ANIMATION.IDLE];
		console.log('Assets loaded and ready!');
	}

	private playIntro() {
		if (
			this._position.x +
				this._spritesheet!.img.width /
					this._spritesheet!.spriteSheetColumCount /
					2 <
			this._context.canvas.width / 2 - 10 // 10 for the movementdistance x2 to center the cat
		) {
			this.moveRight();
		} else {
			this._playIntro = false;
		}
	}

	// DRAW ON CONTEXT RELATED FUNCTIONS
	public draw() {
		this._delayFrameIndexCount++;
		const spritesheet = this._spritesheet;
		if (spritesheet === null) {
			return;
		}

		// TODO: Remove condition with fullfilled once
		if (this._playIntro) {
			this.playIntro();
		}

		this.drawLudeCat();
		this.updateImageToDraw();
	}

	private drawLudeCat() {
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

	private updateImageToDraw() {
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
	public moving(moving: LUDECATSTATE) {
		if (this._spritesheets === null) {
			return;
		}
		const movingState = {
			[LUDECATSTATE.IDLE]: ANIMATION.IDLE,
			[LUDECATSTATE.WALKING_LEFT]: ANIMATION.WALK_LEFT,
			[LUDECATSTATE.WALKING_RIGHT]: ANIMATION.WALK_RIGHT,
			[LUDECATSTATE.WALKING_DOWN]: ANIMATION.IDLE,
			[LUDECATSTATE.WALKING_UP]: ANIMATION.IDLE,
		};

		if (moving !== this._moving) {
			this._moving = moving;
			if (moving) {
				this._spritesheet = this._spritesheets[
					movingState[this._moving]
				];
			} else {
				this._spritesheet = this._spritesheets[ANIMATION.IDLE];
			}
		}
	}

	public moveRight() {
		const { _position, _spritesheet, _moveDistance: moveDistance } = this;
		const canvasWidth = this._context.canvas.width;

		const destinationX =
			_position.x +
			_spritesheet!.img.width / this._spritesheet!.spriteSheetColumCount +
			moveDistance;

		if (destinationX <= canvasWidth) {
			this.moving(LUDECATSTATE.WALKING_RIGHT);
			_position.x += moveDistance;
		}
	}

	public moveLeft() {
		if (this._playIntro) {
			return;
		}

		const { _position, _moveDistance: moveDistance } = this;

		const destinationX = _position.x - moveDistance;
		if (destinationX >= 0) {
			this.moving(LUDECATSTATE.WALKING_LEFT);
			_position.x += -moveDistance;
		}
	}

	public moveUp() {
		if (this._playIntro) {
			return;
		}

		const { _position, _moveDistance: moveDistance } = this;

		const destinationY = _position.y - moveDistance;

		if (destinationY >= 0) {
			this.moving(LUDECATSTATE.WALKING_UP);
			_position.y += -moveDistance;
		}
	}

	public moveDown() {
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
			this.moving(LUDECATSTATE.WALKING_UP);
			_position.y += moveDistance;
		}
	}

	// AUDIO RELATED FUNCTIONS
	public nya() {
		if (this._audio !== null) {
			AudioManager.playSound(this._audio[AUDIO.NYA]);
		}
	}

	public meow() {
		if (this._audio !== null) {
			AudioManager.playSound(this._audio[AUDIO.MEOW]);
		}
	}

	public meow2() {
		if (this._audio !== null) {
			AudioManager.playSound(this._audio[AUDIO.MEOW2]);
		}
	}
}
