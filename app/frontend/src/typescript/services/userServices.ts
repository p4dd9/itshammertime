import { TransactionObject } from '../../types/twitch';
import UserDTO from '../../../../backend/src/dto/UserDTO';

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

export const loadUserData = async (
	id: string
): Promise<UserDTO | null | undefined> => {
	try {
		const response = await window.fetch(
			`http://localhost:3535/user/${id}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		const user = await response.json();
		return user;
	} catch (e) {
		throw new Error(e);
	}
};
