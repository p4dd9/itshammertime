import express from 'express';
import { Authentication } from '../authentication/Authentication';
import { logger } from '../logger';
import { CheerEmoteService } from '../services/EmotesService';

export class TwitchController {
	private cheerEmoteService: CheerEmoteService;

	constructor(authentication: Authentication) {
		this.cheerEmoteService = new CheerEmoteService(authentication);

		this.handleGlobalCheerEmotes = this.handleGlobalCheerEmotes.bind(this);
	}

	public async handleGlobalCheerEmotes(
		req: express.Request,
		res: express.Response
	): Promise<void> {
		try {
			res.send(await this.cheerEmoteService.fetchBitEmotes());
			logger.info(`fetch GlobalEmotes`);
		} catch (e) {
			logger.error(`Couldn't fetch global cheer emotes: ${e}`);
			res.send({ message: 'couldnt fetch global cheer emotes' });
		}
	}
}
