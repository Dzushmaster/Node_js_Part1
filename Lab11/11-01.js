const WebSocket = require('ws');
const fs = require('fs');
const wss = new WebSocket.Server({port:4000, host:'localhost'});
console.log('ws: Server open');
let k = 0;
wss.on('connection', (ws) =>{
    const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf8'});
    let wfile = fs.createWriteStream(`./upload/file${++k}.txt`);
    duplex.pipe(wfile);
});