const http = require('http');
const options = {
    host:'localhost',
    port:5000,
    path:'/task4',
    method:'POST',
    headers:{
        'content-type':'application/json','accept':'application/json'
    }
};
const json = JSON.stringify({
    __comment:'Request',
    x:7,
    y:19,
    s:'Message: ',
    m:['m','e','n'],
    o:{surname: 'Kaminsky', name:'Dmitry'}
});
const req = http.request(options, (res)=>{
    console.log(`Statuscode: ${res.statusCode} - Message: ${res.statusMessage}`);
    let data = '';
    res.on('data', (chunk)=>{
        console.log('http.request: data: body = ',data +=chunk.toString('utf8'));
    });
    res.on('end', ()=>{
        console.log('http.request: end: body = ', JSON.parse(data));
    });
});
req.write(json);
req.end();