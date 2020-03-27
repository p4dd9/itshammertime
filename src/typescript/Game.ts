import GameInput from './GameInput';
import LudeCat from './LudeCat';
import Debugger from './Debugger';
import UI from './GameUI';
import GameAudio from './GameAudio';
import GameCursor from './GameCursor';
import GameCursorWeapon from './GameCursorWeapon';

export default class Game {
	public debug: boolean = true;
	public ui: UI;
	public gameAudio: GameAudio;
	public ludecat: LudeCat;
	public gameCursorWeapon: GameCursorWeapon;

	private _context: CanvasRenderingContext2D;
	private _gameInput: GameInput;
	private _debugger: Debugger;
	private _gameCursor: GameCursor;

	constructor(context: CanvasRenderingContext2D) {
		this._context = context;
		this.ludecat = new LudeCat(this._context);
		this._gameInput = new GameInput(this.ludecat);
		this._debugger = new Debugger(this);
		this.ui = new UI(this);
		this.gameAudio = new GameAudio(this);
		this._gameCursor = new GameCursor(this._context);
		this.gameCursorWeapon = new GameCursorWeapon(
			this._context,
			this._gameCursor
		);

		this._step = this._step.bind(this);
	}

	public get context(): CanvasRenderingContext2D {
		return this._context;
	}

	public resize(canvasWidth: number, canvasHeight: number) {
		this._context.canvas.width = canvasWidth;
		this._context.canvas.height = canvasHeight;

		this.ludecat.resizeCanvas(canvasWidth, canvasHeight);
	}

	private clearCanvas() {
		this._context.clearRect(
			0,
			0,
			this._context.canvas.width,
			this._context.canvas.height
		);
	}

	private _step() {
		// Check for controller input every drawn frame
		this._gameInput.handleInput();

		this.clearCanvas();

		// ACTUAL DRAWINGS
		if (this.debug) {
			this._debugger.debug();
		}

		this.ludecat.draw();
		this.gameCursorWeapon.draw();

		window.requestAnimationFrame(this._step);
	}

	public start() {
		window.requestAnimationFrame(this._step);
	}
}
