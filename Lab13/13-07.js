const net = require('net');
let HOST = '0.0.0.0'
let PORT1 = 40000;
let PORT2 = 50000;
net.createServer((Server)=> ServerStart(Server)).listen(PORT1, HOST);
net.createServer((Server)=> ServerStart(Server)).listen(PORT2, HOST);
function ServerStart(sock){
    console.log(`Server connected: ${sock.remoteAddress}:${sock.remotePort}`);
    sock.on('error', (e)=>{
        console.log(`Server error: ${e}`);
    });
    let num = 0;
    sock.on('data', (data)=>{
        num = data.readInt32LE().toString();
        console.log(`Server data: ${num}`);
        sock.write('ECHO: ' + num);
    });
}