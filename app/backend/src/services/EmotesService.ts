import { Authentication } from '../authentication/Authentication';
import { logger } from '../logger';
import fetch from 'node-fetch';

interface GlobalTwitchBadgeEmote {
	data: [
		{
			set_id: string;
			versions: [GlobalTwitchBadgeSet];
		}
	];
}

interface GlobalTwitchBadgeSet {
	id: string;
	image_url_1x: string;
	image_url_2x: string;
	image_url_4x: string;
}

interface BitEmote {
	tier1: { bit: string; cheer: string };
	tier2: { bit: string; cheer: string };
	tier3: { bit: string; cheer: string };
	tier4: { bit: string; cheer: string };
}

export class CheerEmoteService {
	private authentication: Authentication;

	constructor(authentication: Authentication) {
		this.authentication = authentication;
	}

	public async fetchBitEmotes(): Promise<BitEmote | undefined> {
		try {
			const url = 'https://api.twitch.tv/helix/chat/badges/global';
			const res = await fetch(url, {
				headers: {
					'Client-Id': process.env.TWITCH_CLIENT_ID as string,
					Authorization: `Bearer ${this.authentication.appAccessToken?.access_token}`,
				},
			});

			if (res.ok) {
				const emotes = (await res.json()) as GlobalTwitchBadgeEmote;
				const bits = emotes.data.find((set) => set.set_id === 'bits')
					?.versions as GlobalTwitchBadgeSet[];
				logger.info('Successful fetch of GlobalTwitchBadgeEmotes');
				return {
					tier1: { bit: bits[0].image_url_2x, cheer: bits[0].image_url_2x },
					tier2: { bit: bits[1].image_url_2x, cheer: bits[1].image_url_2x },
					tier3: { bit: bits[2].image_url_2x, cheer: bits[2].image_url_2x },
					tier4: { bit: bits[3].image_url_2x, cheer: bits[3].image_url_2x },
				};
			} else {
				logger.error("Couldn't fetchBitEmotes");
				return;
			}
		} catch (e) {
			logger.error(`Couldn't fetch global cheeremotes: ${e}`);
		}
	}
}
