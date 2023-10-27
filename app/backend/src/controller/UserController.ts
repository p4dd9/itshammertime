import express from 'express';
import DBClient from '../DBClient';
import { logger } from '../logger';
import UserDTO from '../dto/UserDTO';
import UserTransactionDTO from '../dto/UserTransactionDTO';
import { UserService } from '../services/UserService';

export default class UserController {
	private dbClient: DBClient;
	private userService: UserService;

	constructor(dbClient: DBClient) {
		this.dbClient = dbClient;

		this.handleGetUsers = this.handleGetUsers.bind(this);
		this.handleUseBits = this.handleUseBits.bind(this);
		this.handleGetUser = this.handleGetUser.bind(this);

		this.userService = new UserService(this.dbClient);
	}

	public async handleGetUsers(req: express.Request, res: express.Response): Promise<void> {
		try {
			const usersCollection = this.dbClient.db().collection('users');
			const users = await usersCollection.find().toArray();
			res.send(users);
			logger.info(`looked up users`);
		} catch (e) {
			logger.error(e);
			res.send({ message: 'couldnt get users' });
		}
	}

	public async handleGetUser(
		req: express.Request,
		res: express.Response
	): Promise<UserDTO | null | undefined> {
		try {
			const user = await this.userService.findUser(req.params.id);
			const userString = JSON.stringify(user);

			logger.info(`looked up user ${req.params.id}`);
			res.send(userString);
			return user;
		} catch (e) {
			logger.error(e);
			res.send({ message: 'couldnt get user' });
		}
	}

	// TODO: check if body is userdto sheme
	// TODO: validate user authenticity
	public async handleUseBits(req: express.Request, res: express.Response): Promise<void> {
		try {
			const body: UserTransactionDTO = req.body;
			this.userService.updateUser(body);

			const user = await this.userService.findUser(body.id);
			res.send({
				message: 'success',
				user,
			});
		} catch (e) {
			logger.error(e);
			res.send({ message: 'error: couldnt write to users' });
		}
	}
}
