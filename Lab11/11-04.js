const ERROR_KEYS_OVERFLOW = -2;
const ERROR_UNDEFINED_KEY = -1;
const CLIENT_FIELD = 'client';
const TIMESTAMP_FIELD = 'timestamp';
const WebSocket = require('ws');
const wss = new WebSocket.Server({port:4000, host:'localhost'});
let k = 0;
wss.on('connection',(ws)=>{
    ws.on('message', (json)=>{
        let data = JSON.parse(json);
        if(checkJSON(data, ws) != 0)
            return;
        console.log(data);
        ws.send(JSON.stringify({server: ++k, client: data.client, timestamp: new Date().toISOString()}));
    });
});

const checkJSON = (data, ws)=>{
    let keys = Object.keys(data);
    if(keys.length > 2){
        ws.send(ERROR_KEYS_OVERFLOW);
        return ERROR_KEYS_OVERFLOW;
    }
    if(keys[0] != CLIENT_FIELD || keys[1] != TIMESTAMP_FIELD){
        ws.send(ERROR_UNDEFINED_KEY);
        return ERROR_UNDEFINED_KEY;
    }
    return 0;
}
