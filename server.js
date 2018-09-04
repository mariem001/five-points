const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;
const hostname = '127.0.0.1';
const server = http.createServer(app);

server.listen(port, hostname);
