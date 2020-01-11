import IPosition from '../interfaces/IPosition';
import ANIMATION from '../enums/spritesheets';
import LUDECATSTATE from '../enums/ludecatstate';
import {
	spriteSheetColumCount,
	spriteSheetRowCount,
	scaleOnCanvas,
	frameCount,
} from '../config/ludeCatConfig';
import AssetLoader from './AssetLoader';
import AudioManager from './AudioManager';
import AUDIO from '../enums/audio';

export default class LudeCat {
	private _moveDistance = 5;
	private _moving: LUDECATSTATE = LUDECATSTATE.IDLE;
	private _position: IPosition = {
		x: 0,
		y: 0,
	};

	private _delayFrameIndexCount = 0;
	private _delayFrameThreshold = 2;

	// Spritesheet Stuff to render
	private _frameIndex = 0;
	private _rowIndex = 0;
	private _colIndex = 0;
	private _context: CanvasRenderingContext2D;

	private _spritesheet: HTMLImageElement | null = null;
	private _spritesheets: HTMLImageElement[] | null = null;
	private _audio: HTMLAudioElement[] | null = null;

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
		const spritesheets = await AssetLoader.loadImages();

		console.log('Assets loaded...');
		this._audio = audio;
		this._spritesheets = spritesheets;
		this._spritesheet = spritesheets[ANIMATION.IDLE];
	}

	public draw() {
		const { _context, _colIndex, _rowIndex, _position } = this;
		this._delayFrameIndexCount++;
		const image = this._spritesheet;
		if (image === null) {
			return;
		}

		const frameWidth = image.width / spriteSheetColumCount;
		const frameHeight = image.height / spriteSheetRowCount;
		_context.drawImage(
			image,
			_colIndex * frameWidth,
			_rowIndex * frameHeight,
			frameWidth,
			frameHeight,
			_position.x,
			_position.y,
			frameWidth / scaleOnCanvas,
			frameHeight / scaleOnCanvas
		);

		// Update Rows or Col Index only
		// Slower animation by waiting 3 steps to draw new spritesheet subimage
		if (this._delayFrameIndexCount > this._delayFrameThreshold) {
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
			_spritesheet!.width / spriteSheetColumCount +
			moveDistance;

		if (destinationX <= canvasWidth) {
			this.moving(LUDECATSTATE.WALKING_RIGHT);
			_position.x += moveDistance;
		}
	}

	public moveLeft() {
		const { _position, _moveDistance: moveDistance } = this;

		const destinationX = _position.x - moveDistance;
		if (destinationX >= 0) {
			this.moving(LUDECATSTATE.WALKING_LEFT);
			_position.x += -moveDistance;
		}
	}

	public moveUp() {
		const { _position, _moveDistance: moveDistance } = this;

		const destinationY = _position.y - moveDistance;

		if (destinationY >= 0) {
			this.moving(LUDECATSTATE.WALKING_UP);
			_position.y += -moveDistance;
		}
	}

	public moveDown() {
		const { _position, _moveDistance: moveDistance, _spritesheet } = this;
		const canvasHeight = this._context.canvas.height;

		const destinationY =
			_position.y +
			_spritesheet!.height / spriteSheetRowCount +
			moveDistance;
		if (destinationY < canvasHeight) {
			this.moving(LUDECATSTATE.WALKING_UP);
			_position.y += moveDistance;
		}
	}

	public meow() {
		if (this._audio !== null) {
			AudioManager.playSound(this._audio[AUDIO.MEOW]);
		}
	}

	public nya() {
		if (this._audio !== null) {
			AudioManager.playSound(this._audio[AUDIO.NYA]);
		}
	}

	public meow2() {
		if (this._audio !== null) {
			AudioManager.playSound(this._audio[AUDIO.MEOW2]);
		}
	}
}
