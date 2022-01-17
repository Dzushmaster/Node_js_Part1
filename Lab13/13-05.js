const net = require('net');
let HOST = '0.0.0.0';
let PORT = 40000;
let sum = 0;
let connections = new Map();
let server = net.createServer();
server.on('connection', (sock)=>{
    sock.id = (new Date()).toISOString();
    connections.set(sock.id, 0);
    console.log(`Server connected: ${sock.remoteAddress}:${sock.remotePort}`);
    sock.on('data', (data)=>{
        console.log(`Server data: ${data.readInt32LE()}`);
        sum = data.readInt32LE() + connections.get(sock.id);
        connections.set(sock.id, sum);
        console.log(`Sum: ${sum}`);
        sum = 0;
    });
    let buffer = Buffer.alloc(4);
    let writer = setInterval(()=>{
        buffer.writeInt32LE(connections.get(sock.id),0);
        sock.write(buffer);
    },5000);
    sock.on('close', ()=>{
        clearInterval(writer);
        connections.delete(sock.id);
        console.log('Server closed');
    });
    sock.on('error', (e)=>{
        console.log(`Server error: ${e}`);
        connections.delete(sock.id);
    });
});
server.on('listening', ()=>{
    console.log(`Server connected: ${HOST}:${PORT}`);
});
server.on('error', (e)=>{
    console.log(`TCP-Server error: ${e}`);
})
server.listen(PORT, HOST);