var http = require('http');
var fs = require('fs');

http.createServer(function (request, response) {
	const fname = './image.png';
	let png = null;
	if(request.method == 'GET'){
		fs.stat(fname, (err, stat)=>{
			if(err){console.log('error:', err);}
			else{
				png = fs.readFileSync(fname);
				response.writeHead(200, {'Content-Type': 'image/png', 'Content-Length':stat.size});
				response.end(png, 'binary');
			}
		});
	}
	else
	{
		response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
		response.end('Use get method');
	}
}).listen(5000);
console.log('Сервер запущен на http://localhost:5000');