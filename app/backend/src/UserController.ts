import express from 'express';
import DBClient from './DBClient';
import { logger } from './logger';
import UserDTO from './dto/UserDTO';

export default class UserController {
	private dbClient: DBClient;

	constructor(dbClient: DBClient) {
		this.dbClient = dbClient;

		this.handleGetUsers = this.handleGetUsers.bind(this);
		this.handleUseBits = this.handleUseBits.bind(this);
	}

	public async handleGetUsers(
		req: express.Request,
		res: express.Response
	): Promise<void> {
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

	// check if body is userdto sheme
	public async handleUseBits(
		req: express.Request,
		res: express.Response
	): Promise<void> {
		try {
			const body: UserDTO = req.body;
			const userExists = await this.userExists(body.id);

			if (userExists) {
				this.updateUser(body.id, body.bit_count);
			} else {
				this.insertUser(body);
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
			return (await this.dbClient
				.db()
				.collection('users')
				.find({ id })
				.count()) > 0
				? true
				: false;
		} catch (e) {
			logger.error(e);
			throw new Error(e);
		}
	}

	private async updateUser(id: string, bits: number): Promise<void> {
		try {
			await this.dbClient
				.db()
				.collection('users')
				.findOneAndUpdate(
					{ id },
					{ $inc: { bit_count: Number(bits) } }
				);
			logger.info(`updated user ${id}`);
		} catch (e) {
			logger.error(e);
			throw new Error(e);
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
			throw new Error(e);
		}
	}

	private async findUser(id: string): Promise<UserDTO | null> {
		try {
			return await this.dbClient.db().collection('users').findOne({ id });
		} catch (e) {
			logger.error(e);
			throw new Error(e);
		}
	}
}
