import GameInput from './GameInput';
import LudeCat from './LudeCat';
import Debugger from './Debugger';
import UI from './GameUI';

export default class Game {
	public _debug: boolean = true;

	private _context: CanvasRenderingContext2D;
	private _ludecat: LudeCat;
	private _gameInput: GameInput;
	private _debugger: Debugger;
	private _ui: UI;

	constructor(context: CanvasRenderingContext2D) {
		this._context = context;
		this._ludecat = new LudeCat(this._context);
		this._gameInput = new GameInput(this._ludecat);
		this._debugger = new Debugger(this);
		this._ui = new UI();

		console.log('Checking for UI (commit this): ' + this._ui);

		this._step = this._step.bind(this);
	}

	public get context(): CanvasRenderingContext2D {
		return this._context;
	}

	public resize(canvasWidth: number, canvasHeight: number) {
		this._context.canvas.width = canvasWidth;
		this._context.canvas.height = canvasHeight;

		this._ludecat.resizeCanvas(canvasWidth, canvasHeight);
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
		if (this._debug) {
			this._debugger.debug();
		}

		this._ludecat.draw();

		window.requestAnimationFrame(this._step);
	}

	public start() {
		window.requestAnimationFrame(this._step);
	}
}
