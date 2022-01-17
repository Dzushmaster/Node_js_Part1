const colors = require('colors');
const url = require('url');
const httpserver = require('http').createServer((req, res)=>{
    let q = url.parse(req.url, true);
    console.log(q.pathname);
    if(req.method === 'GET' && q.pathname === '/start'){
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        res.end(require('fs').readFileSync('./10-01.html'));
    }
    else{
        console.log('Try to use GET method and /start in url');
        res.writeHead(400, {'Content-Type':'text/html; charset=utf-8'});
        res.end('Try to use GET method and /start in url');
    }
});
httpserver.listen(3000);
console.log('http server: 3000');
let usersId = 0;
let k = 0;
const WebSocket = require('ws');
const wsserver = new WebSocket.Server({port: 4000, host:'localhost', path:'/wsserver'});
wsserver.on('connection', (ws)=>{
    ws.on('message', message=>{
        if(message.toString() === 'newConnection'){
            ws.send(`userId: ${++usersId}`);
            console.log(`userId: ${usersId}`);
        }
        else {
        console.log(`Received message => ${message}`);
        let numb = message.toString().split(' ')[1];
        let ID = getUsersId(message);
        setInterval(()=>{ws.send(`10-01-server: ${numb} -> ${colors.red(++k)} to ${ID}`)}, 5000);
        }
    });
});
wsserver.on('error', (e)=>{console.log('ws server error', e)});
console.log(`ws server: host:${wsserver.options.host}, port:${wsserver.options.port}, path:${wsserver.options.path}`);
const getUsersId = (message)=>{return message.toString().split('-')[0];};