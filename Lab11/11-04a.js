const ERROR_KEYS_OVERFLOW = '-2';
const ERROR_UNDEFINED_KEY = '-1';
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:4000');
let interval = 0;
let parm = process.argv[2];
let clientName = typeof parm == 'undefined'? 'defaultName' :parm;
ws.on('open', ()=>{
    ws.on('message', (json)=>{
        if(checkJSON(json) != 0){
            clearInterval(interval);
            rl.close();
            return;
        }else{
            console.log(JSON.parse(json));
        }
    });
    let k = 0;
    interval = setInterval(()=>{
        ws.send(JSON.stringify({client:`${clientName}`, timestamp: new Date().toISOString()}));
    }, 2000);
});

const checkJSON = (json)=>{
    switch(json)
    {
        case ERROR_UNDEFINED_KEY:
            console.log('Error: ERROR_UNDEFINE_KEY');
            return -1;
        case ERROR_KEYS_OVERFLOW:
            console.log('Error: ERROR_KEYS_OVERFLOW');
            return -1;
        default:
            return 0;
    }
}