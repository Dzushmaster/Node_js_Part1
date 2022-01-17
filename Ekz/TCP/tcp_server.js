const net = require('net');
const HOST = '0.0.0.0';
const PORT = 3000;
let sum = 0;
const server = net.createServer();
server.on('connection', (sock)=>{
    console.log('Client connected: ' + sock.remoteAddress + ':' + sock.remotePort);
    sock.on('data', (data)=>{
        console.log('Server DATA:', data, sum);
        sum+= data.readInt32LE();
    });
    let buf = Buffer.alloc(4);
    setInterval(()=>{
        buf.writeInt32LE(sum, 0);
        sock.write(buf);
    }, 5000)
    sock.on('close', () =>{
        console.log('Socket CLOSED: ', sock.remoteAddress + ':' + sock.remotePort);
    })
    sock.on('error', (err)=>{
        console.log(err);
    });
});
server.listen(PORT, HOST, ()=>{
    console.log(`Connected: ${HOST}:${PORT}`);
});