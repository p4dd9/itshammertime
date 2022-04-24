import express from 'express';
import DBClient from '../DBClient';
import { logger } from '../logger';
import UserDTO from '../dto/UserDTO';

export default class UserController {
	private dbClient: DBClient;

	constructor(dbClient: DBClient) {
		this.dbClient = dbClient;

		this.handleGetUsers = this.handleGetUsers.bind(this);
		this.handleUseBits = this.handleUseBits.bind(this);

		this.insertUser = this.insertUser.bind(this);
		this.findUser = this.findUser.bind(this);
		this.updateUser = this.updateUser.bind(this);
		this.userExists = this.userExists.bind(this);
		this.handleGetUser = this.handleGetUser.bind(this);
	}

	public async handleGetUsers(req: express.Request, res: express.Response): Promise<void> {
		try {
			const usersCollection = this.dbClient.db().collection('users');
			usersCollection.find().toArray((error, users) => {
				res.send(users);
			});
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
			const user = await this.findUser(req.params.id);
			const userString = JSON.stringify(user);

			logger.info(`looked up user ${req.params.id}`);
			res.send(userString);
			return user;
		} catch (e) {
			logger.error(e);
			res.send({ message: 'couldnt get user' });
		}
	}

	// check if body is userdto sheme
	public async handleUseBits(req: express.Request, res: express.Response): Promise<void> {
		try {
			const body: UserDTO = req.body;
			const userExists = await this.userExists(body.id);

			if (userExists) {
				this.updateUser(body.id, body.bit_count);
				logger.info(`updated existing user ${body.id} using ${body.bit_count} bits`);
			} else {
				this.insertUser(body);
				logger.info(`created new user ${body.id}`);
			}

			const user = await this.findUser(body.id);
			res.send({
				message: 'success',
				user,
			});
		} catch (e) {
			logger.error(e);
			res.send({ message: 'error: couldnt write to users' });
		}
	}

	// also could do an upsert: true option in the updateUser function instead of checking
	private async userExists(id: string): Promise<boolean> {
		try {
			const response =
				(await this.dbClient.db().collection('users').find({ id }).count()) > 0;
			return response;
		} catch (e) {
			logger.error(e);
			throw new Error("Couldn't check if user exists");
		}
	}

	private async updateUser(id: string, bits: number): Promise<void> {
		try {
			await this.dbClient
				.db()
				.collection('users')
				.findOneAndUpdate({ id }, { $inc: { bit_count: Number(bits) } });
			logger.info(`updated user ${id} by ${bits} bits`);
		} catch (e) {
			logger.error(e);
			throw new Error(`Couldn't update if user with id ${id}`);
		}
	}

	private async insertUser(user: UserDTO): Promise<void> {
		try {
			await this.dbClient
				.db()
				.collection('users')
				.insertOne({ id: user.id, bit_count: Number(user.bit_count) });
			logger.info(`inserted user ${user.id}`);
		} catch (e) {
			logger.error(e);
			throw new Error(`Failed inserting user with ${user.id}`);
		}
	}

	private async findUser(id: string): Promise<UserDTO | null> {
		try {
			const user = await this.dbClient.db().collection('users').findOne({ id });
			if (user) {
				return user as UserDTO;
			} else {
				return null;
			}
		} catch (e) {
			logger.error(e);
			throw new Error(`Failed finding user with id ${id}`);
		}
	}
}
