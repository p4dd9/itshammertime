import { MongoClient, Db } from 'mongodb';
import { logger } from './logger';

export default class DBClient {
	private uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;
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
			logger.info('mongoclient connected');
		} catch (e) {
			logger.error(e);
		}
	}

	public db(): Db {
		return this.mongo.db('itshammertime');
	}
}
