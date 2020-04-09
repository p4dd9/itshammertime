import '../vendor/analytics';
import Controller from './Controller';
import Debugger from './Debugger';
import UI from './GameUI';
import GameAudio from './GameAudio';
import Weapon from './Weapon';
import HammerWeapon from './weapons/HammerWeapon';
import effectSettings from '../config/effectSettings';

export default class Game {
	public ui: UI;
	public gameAudio: GameAudio;

	private gameController: Controller | null;
	private effectSettings = effectSettings;

	private _weapon: Weapon | null = null;
	public contexts: CanvasRenderingContext2D[];

	public debug = false;
	private debugger: Debugger;

	constructor(contexts: CanvasRenderingContext2D[]) {
		this.contexts = contexts;

		this.debugger = new Debugger(this);
		this.ui = new UI(this, this.effectSettings);
		this.gameAudio = new GameAudio(this);

		const newWeapon = new HammerWeapon(
			contexts[2],
			{ x: 200, y: 200 },
			this.effectSettings
		);
		this._weapon = newWeapon;
		this.gameController = new Controller(newWeapon, this.contexts[2]);

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
		this.gameController = new Controller(weapon!, this.contexts[2]);
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
