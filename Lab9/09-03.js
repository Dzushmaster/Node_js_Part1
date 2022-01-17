let http = require('http');
let query = require('querystring');
let parms = query.stringify({x:3, y:4, s:'sss'});
let path = '/task3';
console.log(`params: ${parms}`);
let options={
    host:'localhost',
    path: path,
    port:5000,
    method:'POST'
};
const req = http.request(options, (res)=>{
   console.log(`Statuscode: ${res.statusCode} - Message: ${res.statusMessage}`);
   let data = '';
   res.on('data', (chunk)=>{
       console.log('http.request: data: body = ',data +=chunk.toString('utf8'));
   });
   res.on('end', ()=>{
       console.log('http.request: end: body = ', data);
   });
});
req.on('error', (err)=>{console.log('http.request: error: ', err.message);});
req.write(parms);
req.end();