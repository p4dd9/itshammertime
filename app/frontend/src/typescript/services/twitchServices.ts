import ICheerEmotesResponse from '../../interfaces/ICheerEmotes';

export const fetchCheerEmotes = async (
	clientId: string
): Promise<ICheerEmotesResponse | undefined> => {
	try {
		const twitchBitsActionsResponse = await fetch('https://api.twitch.tv/kraken/bits/actions', {
			headers: {
				'Client-ID': clientId,
				Accept: ' application/vnd.twitchtv.v5+json',
			},
		});

		return await twitchBitsActionsResponse.json();
	} catch (e) {
		console.log(e);
	}
};
