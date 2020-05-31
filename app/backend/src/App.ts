import DBClient from './DBClient';
import Server from './Server';
import { logger } from './logger';

export default class App {
	private dbClient: DBClient;
	private server: Server;

	constructor() {
		this.dbClient = new DBClient();
		this.server = new Server(this.dbClient);

		console.log(this.server);
		logger.info('running ... ');
	}
}
