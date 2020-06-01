import DBClient from './DBClient';
import Server from './Server';
import { logger } from './logger';

export default class App {
	private dbClient: DBClient;

	constructor() {
		this.dbClient = new DBClient();
		new Server(this.dbClient);

		logger.info('running ... ');
	}
}
