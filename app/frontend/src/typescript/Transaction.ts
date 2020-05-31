import { Extension, Product, TransactionObject } from '../types/twitch';

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

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public onTransactionComplete(transactionObject: TransactionObject): void {
		// it must do something ...
	}
}
