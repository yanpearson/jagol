const connect = require('connect');
const app = connect();

const fs = require('fs');

const serveStatic = require('serve-static');
app.use(serveStatic('dist/'));

app.use('/', (req, res, next) => {
	res.writeHead(200, { 'Content-Type': 'text/html' });
	fs.createReadStream('./views/index.html').pipe(res);
});

const http = require('http');
const port = process.env.PORT || 8080;
const server = http.createServer(app).listen(port);
