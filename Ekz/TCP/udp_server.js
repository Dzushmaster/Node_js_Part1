const udp = require('dgram');
const PORT = 3000;
let server = udp.createSocket('udp4');
server.on('error', (err)=>{
    console.log(err);
    server.close();
});
server.on('message', (msg, info)=>{
    console.log('Server: from client ' + msg.toString());
    server.send('ECHO: ' + msg.toString(), info.port, info.address, (err)=>{
        if (err) server.closer();
        else console.log('Server: data is sending to client ');
    });
});
server.on('close', ()=>{
    console.log('Server: socket closed');
});
server.bind(PORT);
