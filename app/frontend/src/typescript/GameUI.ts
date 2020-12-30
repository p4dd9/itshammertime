import Game from './Game';
import IEffectSettings from '../interfaces/IEffectSettings';

import Menu from './ui/Menu';
import AudioButton from './ui/AudioButton';
import FaqButton from './ui/FaqButton';
import Enchantments from './ui/Enchantments';
import GameStartStopButton from './ui/GameStartStopButton';
import { setVisibilityById } from '../util/commonUtil';
import Shop from './ui/Shop';

export default class UI {
	public menu: Menu;
	public audioButton: AudioButton;
	public faqButton: FaqButton;
	public enchantments: Enchantments;
	public gameStartStopButton: GameStartStopButton;
	public shop: Shop;

	constructor(game: Game, effectSettings: IEffectSettings) {
		this.menu = new Menu(game.authentication);
		this.audioButton = new AudioButton(game.audio);
		this.faqButton = new FaqButton();
		this.gameStartStopButton = new GameStartStopButton(game);
		this.enchantments = new Enchantments(game, effectSettings);
		this.shop = new Shop(game, effectSettings, this.gameStartStopButton);
		this.display();
	}

	public display(): void {
		setVisibilityById('game-ui-layer', 'visible');
	}

	public hide(): void {
		setVisibilityById('game-ui-layer', 'hidden');
	}
}
