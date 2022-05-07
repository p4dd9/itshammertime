import UserDTO from '../../../../backend/src/dto/UserDTO';

export const protocol = 'https';
export const baseUrl = 'localhost';
export const port = 3535;

export const sendBits = async (id: string, bit_count: number, sku: string): Promise<boolean> => {
	try {
		const body = JSON.stringify({
			id,
			bit_count,
			sku,
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
		throw new Error(`Couldn't send bit for user: ${id} for product sku: ${sku} `);
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
		throw new Error(`Couldn't load UserData for userId ${id}`);
	}
};
