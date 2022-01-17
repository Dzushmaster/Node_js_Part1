const net = require('net');
let parm = process.argv[2];
let HOST = '127.0.0.1';
let PORT = typeof parm == 'undefined'? 40000: parm;
let client = new net.Socket();
let buffer = new Buffer.alloc(4);
client.connect(PORT, HOST, ()=>{
    console.log(`Client connected: ${client.remoteAddress}:${client.remotePort}`);
    let X = 2;//заменить на любое число после запуска первого пользователя
    let writer = setInterval(()=>{
        client.write((buffer.writeInt32LE(X, 0), buffer));
    }, 1000);
    setTimeout(()=>{
        clearInterval(writer);
        client.end();
    }, 20000);
});
client.on('data', data=>{
    console.log(`Client data: ${data.toString()}`);
});
client.on('close', ()=>{
    console.log(`client closed`);
});
client.on('error', (e)=>{
    console.log(`Client error: ${e}`);
});