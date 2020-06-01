import { TransactionObject } from '../../types/twitch';

export const sendBits = async (
	transactionObject: TransactionObject
): Promise<void> => {
	try {
		const body = JSON.stringify({
			id: String(transactionObject.userId),
			bit_count: Number(transactionObject.product.cost),
		});

		await window.fetch('http://localhost:3535/usebits', {
			method: 'POST',
			body,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (e) {
		throw new Error(e);
	}
};
