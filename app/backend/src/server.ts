import express from 'express';
import DBClient from './DBClient';
import bodyParser from 'body-parser';
import UserController from './controller/UserController';
import cors from 'cors';
import { logger } from './logger';
import https from 'https';
import fs from 'fs';
import { TwitchController } from './controller/TwitchController';
import { CheerEmoteService } from './services/EmotesService';
import { Authentication } from './authentication/Authentication';

const serverOptions = {
	key: fs.readFileSync('server.key'),
	cert: fs.readFileSync('server.cert'),
	port: 3535,
};

export default class Server {
	private express: express.Express;
	private httpsServer: https.Server;
	private dbClient: DBClient;
	private authentication: Authentication;

	private cheerEmoteService: CheerEmoteService;

	private userController: UserController;
	private twitchController: TwitchController;

	constructor(dbClient: DBClient, authentication: Authentication) {
		this.dbClient = dbClient;
		this.authentication = authentication;

		this.express = express();

		this.httpsServer = https.createServer(
			{
				key: serverOptions.key,
				cert: serverOptions.cert,
			},
			this.express
		);
		this.start();

		this.cheerEmoteService = new CheerEmoteService(this.authentication);

		this.userController = new UserController(this.dbClient);
		this.twitchController = new TwitchController(this.cheerEmoteService);

		this.express.get('/', this.userController.handleGetUsers);
		this.express.get('/user/:id', this.userController.handleGetUser);
		this.express.post('/usebits', this.userController.handleUseBits);

		this.express.get('/twitch/emotes', this.twitchController.handleGlobalCheerEmotes);
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
