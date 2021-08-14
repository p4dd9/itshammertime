import { MongoClient, Db } from 'mongodb';
import { logger } from './logger';

export default class DBClient {
	private uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;
	private mongo: MongoClient;

	constructor() {
		this.mongo = new MongoClient(this.uri);
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
			logger.error('couldnt connect to server: ', e);
		}
	}

	public db(): Db {
		return this.mongo.db('itshammertime');
	}
}
