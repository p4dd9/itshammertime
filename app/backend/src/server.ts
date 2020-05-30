import express from 'express';
import DBClient from './DBClient';
import bodyParser from 'body-parser';

export default class Server {
	private express: express.Express;
	private dbClient: DBClient;

	constructor(dbClient: DBClient) {
		this.dbClient = dbClient;
		this.express = express();

		this.start();
	}

	private start(): void {
		this.middleware();
		this.listen();
		this.controller();
	}

	private middleware(): void {
		this.express.use(bodyParser.json());
	}

	private listen(): void {
		this.express.listen(3535, () => {
			console.log('listening on 3535');
		});
	}

	private controller(): void {
		this.express.get('/', async (req, res) => {
			try {
				const usersCollection = this.dbClient.db().collection('users');
				usersCollection.find().toArray((error, users) => {
					res.send(users);
				});
			} catch (e) {
				res.send({ message: 'couldnt get users' });
			}
		});

		this.express.post('/users', async (req, res) => {
			try {
				const usersCollection = this.dbClient.db().collection('users');
				await usersCollection.insertOne(req.body);
				res.send({ message: 'success' });
			} catch (e) {
				res.send({ message: 'error: couldnt write to users' });
			}
		});
	}
}
