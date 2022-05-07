import DBClient from '../DBClient';
import UserDTO from '../dto/UserDTO';
import UserTransactionDTO from '../dto/UserTransactionDTO';
import { logger } from '../logger';

export class UserService {
	private dbClient: DBClient;

	constructor(dbClient: DBClient) {
		this.dbClient = dbClient;
	}

	public async updateUser(userTransaction: UserTransactionDTO): Promise<void> {
		try {
			const { id, bit_count, sku } = userTransaction;
			const updateFilter = {
				$inc: { bit_count },
				$addToSet: { products: sku },
			};
			await this.dbClient
				.db()
				.collection('users')
				.updateOne({ id }, updateFilter, { upsert: true });
			logger.info(`updated user with id: ${id}`);
		} catch (e) {
			logger.error(e);
			throw new Error(`Couldn't update user with id: ${userTransaction?.id}`);
		}
	}

	public async findUser(id: string): Promise<UserDTO | null> {
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
