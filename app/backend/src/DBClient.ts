import { MongoClient, Db } from 'mongodb';

export default class DBClient {
	private uri = 'mongodb://localhost:27017';
	private config = {
		useUnifiedTopology: true,
	};
	private mongo: MongoClient;

	constructor() {
		this.mongo = new MongoClient(this.uri, this.config);
		this.start();
	}

	private start(): void {
		this.connect();
	}

	private async connect(): Promise<void> {
		try {
			await this.mongo.connect();
			console.log('mongoclient connected');
		} catch (e) {
			console.log(e);
		}
	}

	public db(): Db {
		return this.mongo.db('itshammertime');
	}
}
