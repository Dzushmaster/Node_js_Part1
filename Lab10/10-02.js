let k = 0;
let usersId;
const colors = require('colors');
const WebSocket = require('ws');
let socket = new WebSocket('ws:/localhost:4000/wsserver');
socket.onopen = ()=>{
    console.log('socket.onopen');
    socket.send('newConnection');
    let idInterval = setInterval(()=>{socket.send(`${colors.yellow(usersId)}-10-01-client: ${++k}`);}, 3000);
    setTimeout(()=>{
        clearInterval(idInterval);
        console.log(`connection "${usersId}" closed`);socket.close()
    }, 25000);
};
socket.onclose = ()=>{console.log('socket.onclose');};
socket.onmessage = (e)=>
{
    if(checkConnection(e)){
        usersId = e.data.split(' ')[1];
        console.log(colors.green(`Users id = ${usersId}`));
    }
    else
    console.log('socket.onmessage', e.data);
}
socket.onerror = function(e){console.log(colors.red(e.message));};
const checkConnection = (e)=>{return e.data.split(':')[0] === 'userId'};