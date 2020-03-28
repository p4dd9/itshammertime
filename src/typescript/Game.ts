import '../vendor/analytics';
import Input from './Input';
import LudeCat from './LudeCat';
import Debugger from './Debugger';
import UI from './GameUI';
import GameAudio from './GameAudio';
import CanvasCursor from './CanvasCursor';
import Weapon from './Weapon';
import HammerWeapon from './weapons/HammerWeapon';

export default class Game {
	public debug = true;
	public ui: UI;
	public gameAudio: GameAudio;
	public ludecat: LudeCat;
	public canvasCursor: CanvasCursor;

	private _weapon: Weapon;
	private _context: CanvasRenderingContext2D;
	private _gameInput: Input;
	private _debugger: Debugger;

	constructor(context: CanvasRenderingContext2D) {
		this._context = context;
		this.canvasCursor = new CanvasCursor(this.context);

		this.ludecat = new LudeCat(this._context);
		this._gameInput = new Input(this.ludecat);
		this._debugger = new Debugger(this);
		this.ui = new UI(this);
		this.gameAudio = new GameAudio(this);
		this._weapon = new HammerWeapon(this._context, this.canvasCursor);

		this._step = this._step.bind(this);
	}

	public get weapon(): Weapon {
		return this._weapon;
	}

	public set weapon(weapon: Weapon) {
		this._weapon.removeEventListeners();
		this._weapon = weapon;
	}

	public get context(): CanvasRenderingContext2D {
		return this._context;
	}

	public resize(canvasWidth: number, canvasHeight: number): void {
		this._context.canvas.width = canvasWidth;
		this._context.canvas.height = canvasHeight;

		this.ludecat.resizeCanvas(canvasWidth, canvasHeight);
	}

	private clearCanvas(): void {
		this._context.clearRect(
			0,
			0,
			this._context.canvas.width,
			this._context.canvas.height
		);
	}

	private _step(): void {
		// Check for controller input every drawn frame
		this._gameInput.handleInput();

		this.clearCanvas();

		// ACTUAL DRAWINGS
		if (this.debug) {
			this._debugger.debug();
		}

		this.ludecat.draw();

		if (this.weapon) {
			this.weapon.draw();
		}

		window.requestAnimationFrame(this._step);
	}

	public start(): void {
		window.requestAnimationFrame(this._step);
	}
}
