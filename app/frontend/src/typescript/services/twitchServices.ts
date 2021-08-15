import { protocol, baseUrl, port } from './userServices';

interface BitEmote {
	tier1: { bit: string; cheer: string };
	tier2: { bit: string; cheer: string };
	tier3: { bit: string; cheer: string };
	tier4: { bit: string; cheer: string };
}
export const fetchCheerEmotes = async (): Promise<BitEmote | undefined> => {
	try {
		const twitchBitsActionsResponse = await fetch(
			`${protocol}://${baseUrl}:${port}/twitch/emotes`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		return await twitchBitsActionsResponse.json();
	} catch (e) {
		console.log(e);
	}
};
