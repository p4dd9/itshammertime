import jwtDecode from 'jwt-decode';

/**
 * Helper class for authentication against an EBS service. Allows the storage of
 * a token to be accessed across componenents.
 * This is not meant to be a source of truth. Use only for presentational purposes.
 */
export default class Authentication {
	public state: {
		token: string;
		opaqueId: string;
		userId: string | boolean;
		isMod: boolean;
		role: string;
	};

	constructor(token = '', opaqueId = '') {
		this.state = {
			token,
			opaqueId,
			userId: false,
			isMod: false,
			role: '',
		};
	}

	public isLoggedIn(): boolean {
		return this.state.opaqueId[0] === 'U' ? true : false;
	}

	// This does guarantee the user is a moderator- this is fairly simple to bypass - so pass the JWT and verify
	// server-side that this is true. This, however, allows you to render client-side UI for users without holding
	// on a backend to verify the JWT.
	// Additionally, this will only show if the user shared their ID, otherwise it will return false.
	public isModerator(): boolean {
		return this.state.isMod;
	}

	// similar to mod status, this isn't always verifiable, so have your backend verify before proceeding.
	public hasSharedId(): boolean {
		return !!this.state.userId;
	}

	public getUserId(): string | boolean {
		return this.state.userId;
	}

	public getOpaqueId(): string {
		return this.state.opaqueId;
	}

	// set the token in the Authentication componenent state
	// this is naive, and will work with whatever token is returned. under no circumstances should you use
	// this logic to trust private data- you should always verify the token on the backend before displaying that data.
	public setToken(token: string, opaqueId: string): void {
		let isMod = false;
		let role = '';
		let userId = '';

		try {
			const decoded = jwtDecode<{ role: string; user_id: string }>(token);

			if (
				decoded.role === 'broadcaster' ||
				decoded.role === 'moderator'
			) {
				isMod = true;
			}

			userId = decoded.user_id;
			role = decoded.role;
		} catch (e) {
			token = '';
			opaqueId = '';
		}

		this.state = {
			token,
			opaqueId,
			isMod,
			userId,
			role,
		};
	}

	// checks to ensure there is a valid token in the state
	public isAuthenticated(): boolean {
		if (this.state.token && this.state.opaqueId) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Makes a call against a given endpoint using a specific method.
	 *
	 * Returns a Promise with the Request() object per fetch documentation.
	 *
	 */
	public makeCall(url: string, method = 'GET'): Promise<unknown> {
		return new Promise((resolve, reject) => {
			if (this.isAuthenticated()) {
				const headers = {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${this.state.token}`,
				};

				fetch(url, {
					method,
					headers,
				})
					.then((response) => resolve(response))
					.catch((e) => reject(e));
			} else {
				reject('Unauthorized');
			}
		});
	}
}
