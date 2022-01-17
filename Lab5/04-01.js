var http = require("http");
var db = require("./DB.js").db;
var url = require("url");
var fs = require("fs");
const history = require("./hist").history;
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
	}
	else if(path == "/api/db"){
		db.emit(request.method, request, response);
		history.emit("Request");
	}
	else if(path == "/api/ss" && request.method == "GET"){
		response.writeHead(200, {"Content-Type": "text/html"});
		response.end(JSON.stringify({
			start: formatDate(history.startTime),
			end: formatDate(history.endTime),
			request: history.req,
			commit: history.commits,
		  }));
	}
});
console.log("http://localhost:5000/api/db");

let sdHand = null;
let ssHand = null;
let scHand = null;

process.stdin.setEncoding("utf-8");
process.stdin.on("readable", ()=>{
	let chunk = null;
	while((chunk = process.stdin.read())!=null){
		if(chunk.includes("sd"))
			sdHand = sd(chunk, sdHand);
		else if(chunk.includes("sc"))
			scHand = sc(chunk, scHand);
		else if(chunk.includes("ss"))
			ssHand = ss(chunk, ssHand);	
	}
});

function sd(command, handler){
	const commandsParts = command.split(" ");
	if(commandsParts.length == 1 && handler !=null){
		clearTimeout(handler);
		console.log("End of sd");
		return null;
	}
	else if(Number.parseInt(commandsParts[1])!=NaN){
		const time = Number.parseInt(commandsParts[1]) * 1000;
		if(handler != null)
		{
			clearTimeout(handler);
			console.log("End of sd");
		}
		return setTimeout(()=>{
			server.close();
			process.exit(0);
		}, time);
	}
}

function sc(command, handler){
	const commandsParts = command.split(" ");
	if(commandsParts.length == 1 && handler != null){
		clearInterval(handler);
		console.log("End of sc");
		return null;
	}
	else if(Number.parseInt(commandsParts[1])!=NaN){
		const interval = Number.parseInt(commandsParts[1]) * 1000;
		if(handler != null)
		{
			clearInterval(handler);
			console.log("End of sc");
		}
		const intervalHandler = setInterval(() =>{
			db.emit("COMMIT");
			history.emit("Commit");
		}, interval);
		
		intervalHandler.unref();
		return intervalHandler;
	
	}
}

function ss(command, handler) {
	const commandsParts = command.split(" ");
	if (commandsParts.length == 1 && handler != null) {
	  clearTimeout(handler);
	  history.emit("End");
	} else if (Number.parseInt(commandsParts[1]) != NaN) {
	  const time = Number.parseInt(commandsParts[1]) * 1000;
	  history.emit("Start");
	  const timeout = setTimeout(() => {
		if (handler != null) clearTimeout(handler);
		history.emit("End");
		console.log("End of ss");
	  }, time);
	  timeout.unref();
	  return timeout;
	}
  }
function formatDate(date){
	return date != null ? `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}` : "";
}