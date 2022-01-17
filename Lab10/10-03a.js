const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:5000/broadcast');

ws.on('open', ()=>{
    ws.send('Message from client');
});
ws.on('close', ()=>{
    console.log('Connection closed');
});
ws.on('message', (message)=>{
    console.log('Message: ', message.toString());
});