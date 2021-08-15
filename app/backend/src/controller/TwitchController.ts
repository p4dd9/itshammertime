import express from 'express';
import { logger } from '../logger';
import { CheerEmoteService } from '../services/EmotesService';

export class TwitchController {
	private emoteService: CheerEmoteService;

	constructor(emoteService: CheerEmoteService) {
		this.emoteService = emoteService;

		this.handleGlobalCheerEmotes = this.handleGlobalCheerEmotes.bind(this);
	}

	public async handleGlobalCheerEmotes(
		req: express.Request,
		res: express.Response
	): Promise<void> {
		try {
			res.send(await this.emoteService.fetchBitEmotes());
			logger.info(`fetch GlobalEmotes`);
		} catch (e) {
			logger.error(`Couldn't fetch global cheer emotes: ${e}`);
			res.send({ message: 'couldnt fetch global cheer emotes' });
		}
	}
}
