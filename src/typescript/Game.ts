import '../vendor/analytics';
import Controller from './Controller';
import Debugger from './Debugger';
import UI from './GameUI';
import GameAudio from './GameAudio';
import Weapon from './Weapon';
import HammerWeapon from './weapons/HammerWeapon';
import effectSettings from '../config/effectSettings';
import LAYERS from '../config/layers';

export default class Game {
	public ui: UI;
	public gameAudio: GameAudio;

	private gameController: Controller | null;
	private effectSettings = effectSettings;

	private _weapon: Weapon | null = null;
	public contexts: CanvasRenderingContext2D[];

	private debug = true;
	private debugger: Debugger;

	constructor(contexts: CanvasRenderingContext2D[]) {
		this.contexts = contexts;

		this.debugger = new Debugger(contexts[LAYERS.BACK]);
		this.ui = new UI(this, this.effectSettings);
		this.gameAudio = new GameAudio(this);

		const newWeapon = new HammerWeapon(
			contexts,
			{ x: 200, y: 200 },
			this.effectSettings
		);
		this._weapon = newWeapon;
		this.gameController = new Controller(
			newWeapon,
			this.contexts[LAYERS.FRONT]
		);

		this.step = this.step.bind(this);
	}

	public get weapon(): Weapon | null {
		return this._weapon;
	}

	public set weapon(weapon: Weapon | null) {
		if (this._weapon) {
			this._weapon.stop();
		}

		this._weapon = weapon;
		this.gameController = new Controller(
			weapon!,
			this.contexts[LAYERS.FRONT]
		);
	}

	public resize(canvasWidth: number, canvasHeight: number): void {
		for (const layer of this.contexts) {
			layer.canvas.width = canvasWidth;
			layer.canvas.height = canvasHeight;
		}

		this.weapon!.resizeCanvas(canvasWidth, canvasHeight);
	}

	private clearCanvas(): void {
		for (const layer of this.contexts) {
			layer.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
		}
	}

	private step(): void {
		if (this.gameController) {
			this.gameController.handleInput();
		}

		this.clearCanvas();

		if (this.debug) {
			this.debugger.debug();
		}

		this.weapon!.draw();

		window.requestAnimationFrame(this.step);
	}

	public start(): void {
		window.requestAnimationFrame(this.step);
	}
}
