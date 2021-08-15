import { TransactionObject } from '../../types/twitch';
import UserDTO from '../../../../backend/src/dto/UserDTO';

export const protocol = 'https';
export const baseUrl = 'localhost';
export const port = 3535;

export const sendBits = async (transactionObject: TransactionObject): Promise<boolean> => {
	try {
		const body = JSON.stringify({
			id: String(transactionObject.userId),
			bit_count: Number(transactionObject.product.cost.amount),
		});

		await window.fetch(`${protocol}://${baseUrl}:${port}/usebits`, {
			method: 'POST',
			body,
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return true;
	} catch (e) {
		throw new Error(e);
	}
};

export const loadUserData = async (
	id: string,
	token: string
): Promise<UserDTO | null | undefined> => {
	try {
		const response = await window.fetch(`${protocol}://${baseUrl}:${port}/user/${id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer' + token,
			},
		});

		return await response.json();
	} catch (e) {
		throw new Error(e);
	}
};

export const hasUsedBits = async (id: string, token: string): Promise<boolean> => {
	try {
		const user = await loadUserData(id, token);
		if (user) {
			return user.bit_count > 0 ? true : false;
		}
		return false;
	} catch (e) {
		throw new Error(e);
	}
};
