const udp = require('dgram');
const PORT = 2000;
let server = udp.createSocket('udp4');
server.on('error', (err)=>{
    console.log('Ошибка: '+ err); server.close();
})
server.on('message', (msg, info)=>{
    console.log('Server: от клиента получено ' + msg.toString());
    console.log('Server: получено %d байтов от %s:%d\n', msg.length, info.address, info.port);
    server.send('ECHO: ' + msg.toString(), info.port, info.address, (err)=>{
        if(err) server.close();
        else console.log('Server: данные отправлены клиенту ');
    });
});
server.on('close', ()=>{
    console.log('Server: сокет закрыт');
});
server.bind(PORT);