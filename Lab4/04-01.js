var http = require("http");
var db = require("./DB.js").db;
var url = require("url");
var fs = require("fs");
const server = http.createServer().listen(5000);
server.on("request", (request, response)=>{
	const path = url.parse(request.url).pathname;
	if(path == "/"){
		fs.readFile("04-02.html", (err, data)=>{
			if(err){
				console.log(err.message);
				return;
			}
			response.writeHead(200, {"Content-Type": "text/html"});
			response.end(data);
		});
	}else if(path == "/api/db")
		db.emit(request.method, request, response);
});
console.log("http://localhost:5000/api/db");


