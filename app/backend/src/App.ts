import DBClient from './DBClient';
import Server from './Server';
import { logger } from './logger';
import { Authentication } from './authentication/Authentication';

export default class App {
	private dbClient: DBClient | null = null;
	private authentication: Authentication | null = null;

	constructor() {
		this.start();
	}

	async start(): Promise<void> {
		this.dbClient = new DBClient();
		new Server(this.dbClient!);

		this.authentication = new Authentication();
		await this.authentication.init();

		logger.info('running ... ');
	}
}
