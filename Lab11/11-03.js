const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 4000, host:'localhost'});
let n = 0;
let connections = 0;
wss.on('connection', (ws)=>{
    ws.on('pong', (data)=>{
        console.log('Server: ',data.toString());
    });
    ws.on('message', (data)=>{
        console.log('on message: ', data.toString());
        ws.send(data);
    });
    setInterval(()=>{ws.ping(`11-03-server: ${++n}`)}, 15000);
//// 1 способ
    setInterval(()=>{
        wss.clients.forEach((client)=>{
            connections ++;
        });
        ws.ping(`Count of connections: ${connections}`);
        connections = 0;
    }, 5000);

//// 2 способ
    
    // setInterval(()=>{
    //     ws.ping(`Count of connections: ${wss.clients.size}`);
    // }, 5000);
});
wss.on('error', (err) =>{
    console.log('wss server error: ',err);
})