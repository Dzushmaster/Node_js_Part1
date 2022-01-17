const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:4000');
const duplex = WebSocket.createWebSocketStream(ws, {encoding: 'utf8'});
duplex.pipe(process.stdout);
process.stdin.pipe(duplex);
var pongi = 0;
ws.on('ping', (data)=>{
    console.log(`Client: `, data.toString());
});