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

export default class LudeCat {
	private moveDistance = 5;
	private _moving: LUDECATSTATE = LUDECATSTATE.IDLE;
	private _catPosition: IPosition = {
		x: 0,
		y: 0,
	};
	private _canvasWidth: number;
	private _canvasHeight: number;

	// Spritesheet Stuff to render
	private _frameIndex = 0;
	private _rowIndex = 0;
	private _colIndex = 0;
	private _context: CanvasRenderingContext2D;

	private _spritesheet: HTMLImageElement | null = null;
	private _spritesheets: HTMLImageElement[] | null = null;
	public _audio: HTMLAudioElement[] | null = null;

	constructor(context: CanvasRenderingContext2D) {
		this._context = context;
		this._canvasWidth = context.canvas.width;
		this._canvasHeight = context.canvas.height;

		this.loadAssets();
	}

	private async loadAssets() {
		const audio = await AssetLoader.loadAudio();
		const spritesheets = await AssetLoader.loadImages();

		console.log('Assets loaded...');
		this._audio = audio;
		this._spritesheets = spritesheets;
		this._spritesheet = spritesheets[ANIMATION.IDLE];
	}

	public get catPosition(): IPosition {
		return this._catPosition;
	}

	public set catPosition(value: IPosition) {
		this._catPosition = value;
	}

	private delayFrameIndexCount = 0;

	public draw() {
		const { _context, _colIndex, _rowIndex, catPosition } = this;
		this.delayFrameIndexCount++;
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
			catPosition.x,
			catPosition.y,
			frameWidth / scaleOnCanvas,
			frameHeight / scaleOnCanvas
		);

		// Update Rows or Col Index only
		// slower animation by waiting 3 steps to draw new spritesheet subimage
		if (this.delayFrameIndexCount > 2) {
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
			this.delayFrameIndexCount = 0;
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

	public resizeCanvas(canvasWidth: number, canvasHeight: number) {
		this._canvasWidth = canvasWidth;
		this._canvasHeight = canvasHeight;
	}

	public moveRight() {
		const { catPosition, _spritesheet, moveDistance } = this;

		const destinationX =
			catPosition.x +
			_spritesheet!.width / spriteSheetColumCount +
			moveDistance;

		if (destinationX <= this._canvasWidth) {
			console.log('Left axe: right');
			this.moving(LUDECATSTATE.WALKING_RIGHT);
			catPosition.x += moveDistance;
		} else {
			console.log('Moved out right');
		}
	}

	public moveLeft() {
		const { catPosition, moveDistance } = this;

		const destinationX = catPosition.x - moveDistance;
		if (destinationX >= 0) {
			console.log('Left axe: left');
			this.moving(LUDECATSTATE.WALKING_LEFT);
			catPosition.x += -moveDistance;
		} else {
			console.log('Moved out left');
		}
	}

	public moveUp() {
		const { catPosition, moveDistance } = this;

		const destinationY = catPosition.y - moveDistance;

		if (destinationY >= 0) {
			console.log('Left axe: up');
			this.moving(LUDECATSTATE.WALKING_UP);
			catPosition.y += -moveDistance;
		} else {
			console.log('Moed out top.');
		}
	}

	public meow() {
		AudioManager.playSound(AssetLoader.audio.meow.id);
	}

	public nya() {
		AudioManager.playSound(AssetLoader.audio.nya.id);
	}

	public meow2() {
		AudioManager.playSound(AssetLoader.audio.meow2.id);
	}

	public moveDown() {
		const { catPosition, moveDistance, _spritesheet } = this;

		const destinationY =
			catPosition.y +
			_spritesheet!.height / spriteSheetRowCount +
			moveDistance;
		if (destinationY < this._canvasHeight) {
			console.log('Left axe: down');
			this.moving(LUDECATSTATE.WALKING_UP);
			catPosition.y += moveDistance;
		} else {
			console.log('Moved out bottom.');
		}
	}
}
