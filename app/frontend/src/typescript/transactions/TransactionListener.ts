import { onSuccessfulClassicPlantHammerTransaction } from '../../util/commonUtil';
import Game from '../Game';

export default class TransactionListener {
	private game: Game;

	constructor(game: Game) {
		this.game = game;
	}
	public addUseBitsListener(element: HTMLElement, sku: string): void {
		element.addEventListener('click', () => {
			// TODO remove for hosted env
			onSuccessfulClassicPlantHammerTransaction();
			this.game.transaction?.useBits(sku);
		});
	}

	public addBitsBalanceListener(element: HTMLElement): void {
		element.addEventListener('mouseenter', () => {
			this.game.transaction?.showBitsBalance();
		});
	}
}
