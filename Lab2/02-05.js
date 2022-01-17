var http = require('http');
var fs = require('fs');
http.createServer(function (request, response) {
	if(request.url === '/fetch')
	{
		let html = fs.readFileSync('fetch.html');
		response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
		response.end(html);
	}
	else if(request.url === '/api/name')
	{
		response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
		response.end('Каминский Дмитрий Викторович');
	}
}).listen(5000)
console.log('Server running. Write http://localhost:5000/fetch');