const net = require('net');
let HOST = '0.0.0.0';
let PORT = 3000;
const client = new net.Socket();
let buffer = new Buffer.alloc(4);
let timerId;
client.connect(PORT, HOST, ()=>{
    console.log('Client CONNECTED: ', client.remoteAddress + ' ' + client.remotePort);
    let k = 0;
    timerId = setInterval(()=>{
        client.write((buffer.writeInt32LE(k++, 0), buffer))
    }, 1000);
    setTimeout(()=>{
        clearInterval(timerId);
        client.end();
    }, 20000);
});
client.on('data', (data)=>{
    console.log('Client DATA: ', data.readInt32LE());
});