import DBClient from './DBClient';
import Server from './Server';

export default class App {
	private dbClient: DBClient;
	private server: Server;

	constructor() {
		this.dbClient = new DBClient();
		this.server = new Server(this.dbClient);

		console.log(this.server);
		console.log('running ... ');
	}
}
