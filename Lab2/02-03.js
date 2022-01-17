var http = require('http');
http.createServer(function(request, response){
	response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
	if(request.method == 'GET'){
			if(request.url === "/api/name")
				response.end("<h2>Каминский Дмитрий Викторович<h2>");
			else
				response.end("Not found");
	}
	else
	response.end('Use get method');	

}).listen(5000);
console.log("Запущен, введите http://localhost:5000/api/name");