import express from 'express';

const server = express();

server.listen(3535, function () {
	console.log('listening on 3535');
});

server.get('/', (req, res) => {
	res.send('Hello World!!!!!!!');
});
