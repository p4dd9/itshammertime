import DBClient from './DBClient';

export default class UserController {
	private dbClient: DBClient;

	constructor(dbClient: DBClient) {
		this.dbClient = dbClient;
	}

	public async handleGetUsers(req, res) {
		try {
			const usersCollection = this.dbClient.db().collection('users');
			usersCollection.find().toArray((error, users) => {
				res.send(users);
			});
		} catch (e) {
			res.send({ message: 'couldnt get users' });
		}
	}
}
