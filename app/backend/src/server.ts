import express from 'express';
import DBClient from './DBClient';
import bodyParser from 'body-parser';
import UserController from './UserController';
import cors from 'cors';
import { logger } from './logger';

export default class Server {
	private express: express.Express;
	private dbClient: DBClient;
	private userController: UserController;

	constructor(dbClient: DBClient) {
		this.dbClient = dbClient;
		this.express = express();
		this.start();

		this.userController = new UserController(this.dbClient);

		this.express.get('/', this.userController.handleGetUsers);
		this.express.post('/usebits', this.userController.handleUseBits);
	}

	private start(): void {
		this.middleware();
		this.listen();
	}

	private middleware(): void {
		this.express.use(cors());
		this.express.use(bodyParser.json());
	}

	private listen(): void {
		this.express.listen(3535, () => {
			logger.info('listening on 3535');
		});
	}
}
