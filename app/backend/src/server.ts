import express from 'express';
import DBClient from './DBClient';
import bodyParser from 'body-parser';
import UserController from './UserController';
import cors from 'cors';
import { logger } from './logger';
import https from 'https';
import fs from 'fs';

const serverOptions = {
	key: fs.readFileSync('server.key'),
	cert: fs.readFileSync('server.cert'),
	port: 3535,
};

export default class Server {
	private express: express.Express;
	private dbClient: DBClient;
	private userController: UserController;
	private httpsServer: https.Server;

	constructor(dbClient: DBClient) {
		this.dbClient = dbClient;
		this.express = express();

		this.httpsServer = https.createServer(
			{
				key: serverOptions.key,
				cert: serverOptions.cert,
			},
			this.express
		);
		this.start();

		this.userController = new UserController(this.dbClient);

		this.express.get('/', this.userController.handleGetUsers);
		this.express.get('/user/:id', this.userController.handleGetUser);
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
		this.httpsServer.listen(serverOptions.port, () => {
			logger.info(`listening to post ${serverOptions.port}`);
		});
	}
}
