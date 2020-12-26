import { Extension, Product, TransactionObject } from '../../types/twitch';
import { onSuccessfulClassicPlantHammerTransaction } from '../../util/commonUtil';
import { sendBits } from '../services/userServices';

export default class Transaction {
	private twitch: Extension;

	constructor(twitch: Extension) {
		this.twitch = twitch;

		this.twitch.bits.onTransactionCancelled(this.onTransactionCancelled);
		this.twitch.bits.onTransactionComplete(this.onTransactionComplete);
	}

	public useBits(sku: string): void {
		this.twitch.bits.useBits(sku);
	}

	public async getProducts(): Promise<Product[]> {
		return await this.twitch.bits.getProducts();
	}

	public showBitsBalance(): void {
		this.twitch.bits.showBitsBalance();
	}

	public setUseLoopback(): boolean {
		return this.twitch.bits.setUseLoopback();
	}

	public onTransactionCancelled(): void {
		// it must do something ...
	}

	public async onTransactionComplete(transactionObject: TransactionObject): Promise<void> {
		const success: boolean = await sendBits(transactionObject);

		// refactor
		if (success) {
			onSuccessfulClassicPlantHammerTransaction();
		}
	}
}
