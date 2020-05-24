import '../vendor/analytics';
import Controller from './Controller';
import Debugger from './Debugger';
import UI from './GameUI';
import GameAudio from './GameAudio';
import Weapon from './Weapon';
import ClassicHammer from './weapons/ClassicHammer';
import effectSettings from '../config/effectSettings';
import LAYERS from '../config/layers';
import { isScreenSizeSupported } from '../util/commonUtil';
import { Extension, ExtensionContext } from '../types/twitch';
import IPosition from '../interfaces/IPosition';

export default class Game {
	public ui: UI;
	public audio: GameAudio;
	public effectSettings = effectSettings;
	public contexts: CanvasRenderingContext2D[];

	private controller: Controller;

	private _weapon: Weapon;

	private debug = false;
	private debugger: Debugger;

	private twitch: Extension | null;
	private frameId: number | undefined = undefined;

	constructor(contexts: CanvasRenderingContext2D[]) {
		this.contexts = contexts;

		this.debugger = new Debugger(contexts[LAYERS.BACK]);
		this.ui = new UI(this, this.effectSettings);
		this.audio = new GameAudio(this);
		this.twitch = window.Twitch ? window.Twitch.ext : null;

		const weapon = new ClassicHammer(
			contexts,
			this.center(),
			this.effectSettings,
			this.audio
		);
		this._weapon = weapon;
		this.controller = new Controller(weapon, this.contexts[LAYERS.FRONT]);
		this.step = this.step.bind(this);

		// TODO: refactor this
		this.addOnResizeListener();
		this.twitch?.onContext((context, delta) => {
			this.contextUpdate(context, delta);
		});
	}

	public get weapon(): Weapon {
		return this._weapon;
	}

	public set weapon(weapon: Weapon) {
		this.controller.stop();
		this._weapon = weapon;
		this.controller = new Controller(weapon, this.contexts[LAYERS.FRONT]);
		this.controller.start();
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private contextUpdate(context: ExtensionContext, delta: [string]): void {
		// It must be doing something ...
	}

	public center(): IPosition {
		return {
			x: window.innerWidth * 0.5,
			y: window.innerHeight * 0.5,
		};
	}

	public resize(): void {
		const resizeWidth = window.innerWidth;
		const resizeHeight = window.innerHeight;

		if (isScreenSizeSupported(window.innerWidth, window.innerHeight)) {
			if (this.frameId !== undefined) {
				for (const layer of this.contexts) {
					layer.canvas.width = resizeWidth;
					layer.canvas.height = resizeHeight;
				}

				this.weapon.resizeCanvas(resizeWidth, resizeHeight);
			} else {
				this.start();
				this.resize();
			}
		} else {
			this.stop();
		}
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
		this.controller.start();
	}

	public stop(): void {
		this.clearCanvas();
		if (this.frameId) {
			window.cancelAnimationFrame(this.frameId);
			this.frameId = undefined;
		}
		this.controller.stop();
	}

	private addOnResizeListener(): void {
		window.onresize = (): void => {
			this.resize();
		};
	}
}
