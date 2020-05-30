import express from 'express';
import mongodb from 'mongodb';
import bodyParser from 'body-parser';
import { s } from './utils';

const mongoClient = mongodb.MongoClient;

const server = express();
server.use(bodyParser.json());

server.listen(3535, function () {
	console.log('listening on 3535');
});

server.get('/', (req, res) => {
	res.send(s);
});

const mongoClientConnectionString = 'mongodb://localhost:27017';

mongoClient
	.connect(mongoClientConnectionString, {
		useUnifiedTopology: true,
	})
	.then((client) => {
		const db = client.db('itshammertime');
		const usersCollection = db.collection('users');

		server.post('/users', (req, res) => {
			console.log(req.body);

			usersCollection
				.insertOne(req.body)
				.then(() => {
					res.send({ message: 'nice' });
				})
				.catch(() => res.send({ message: 'shit' }));
		});
	})
	.catch(console.error);
