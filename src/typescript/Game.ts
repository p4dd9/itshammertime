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
	public audio: GameAudio;

	private controller: Controller;
	private effectSettings = effectSettings;

	private _weapon: Weapon;
	private contexts: CanvasRenderingContext2D[];

	private debug = false;
	private debugger: Debugger;

	private frameId: number | undefined = undefined;

	constructor(contexts: CanvasRenderingContext2D[]) {
		this.contexts = contexts;

		this.debugger = new Debugger(contexts[LAYERS.BACK]);
		this.ui = new UI(this, this.effectSettings);
		this.audio = new GameAudio(this);

		const weapon = new HammerWeapon(
			contexts,
			{ x: 200, y: 200 },
			this.effectSettings
		);
		this._weapon = weapon;
		this.controller = new Controller(weapon, this.contexts[LAYERS.FRONT]);

		this.step = this.step.bind(this);
	}

	public get weapon(): Weapon {
		return this._weapon;
	}

	public set weapon(weapon: Weapon) {
		this._weapon = weapon;
		this.controller = new Controller(weapon, this.contexts[LAYERS.FRONT]);
	}

	public resize(canvasWidth: number, canvasHeight: number): void {
		for (const layer of this.contexts) {
			layer.canvas.width = canvasWidth;
			layer.canvas.height = canvasHeight;
		}

		this.weapon.resizeCanvas(canvasWidth, canvasHeight);
	}

	private clearCanvas(): void {
		for (const layer of this.contexts) {
			layer.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
		}
	}

	private step(): void {
		this.frameId = undefined;
		this.controller.handleInput();
		this.clearCanvas();

		if (this.debug) {
			this.debugger.debug();
		}

		this.weapon.draw();

		this.frameId = window.requestAnimationFrame(this.step);
	}

	public start(): void {
		this.frameId = window.requestAnimationFrame(this.step);
	}

	public stop(): void {
		if (this.frameId) {
			window.cancelAnimationFrame(this.frameId);
			this.frameId = undefined;
		}
	}
}
