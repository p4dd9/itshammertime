import { logger } from '../logger';
import { CronJob } from 'cron';
import fetch from 'node-fetch';

/**
 * No refresh_token for AppAccessToken available.
 * Refresh by interval. Cannot be refreshed.
 *
 * Ref:
 * https://dev.twitch.tv/docs/authentication#refreshing-access-tokens
 * Note: App access tokens and ID tokens cannot be refreshed.
 * Note: App access tokens are only for server-to-server API requests.
 */
interface AppAccessToken {
	access_token: '';
	expires_in: -1;
	scope: [];
	token_type: 'bearer';
}

export class Authentication {
	public appAccessToken: AppAccessToken | null = null;
	private client_id: string = process.env.TWITCH_CLIENT_ID as string;
	private api_client_secret: string = process.env.TWITCH_API_CLIENT_SECRET as string;

	public async init(): Promise<void> {
		await this.fetchAppAccessToken();
		await this.isValidToken();

		new CronJob('0 * * * *', async () => {
			const isValidToken = await this.isValidToken();
			if (!isValidToken) {
				this.fetchAppAccessToken();
			}
		});
	}

	async fetchAppAccessToken(): Promise<void> {
		try {
			const url = `https://id.twitch.tv/oauth2/token?client_id=${this.client_id}&client_secret=${this.api_client_secret}&grant_type=client_credentials&scope=bits:read`;
			const res = await fetch(url, { method: 'POST' });

			if (res.ok) {
				const token = (await res.json()) as AppAccessToken;
				this.appAccessToken = token;
				logger.info('Successfully fetched AppAccessToken');
			} else {
				throw new Error(`Unable to fetch AppAcessToken ${res.status}: ${res.statusText}`);
			}
		} catch (e) {
			logger.error(`Fetch AppAccess token: ${e}`);
		}
	}

	async isValidToken(): Promise<boolean> {
		try {
			const url = 'https://id.twitch.tv/oauth2/validate';
			const res = await fetch(url, {
				method: 'GET',
				headers: {
					Authorization: `OAuth ${this.appAccessToken?.access_token}`,
				},
			});

			if (res.ok) {
				logger.info('Valid token');
				return true;
			} else {
				logger.error(`Invalid/Expired token: ${res.status}: ${res.statusText}`);
				return false;
			}
		} catch (e) {
			logger.error(`Failed verifying token: ${e}`);
			return false;
		}
	}
}
