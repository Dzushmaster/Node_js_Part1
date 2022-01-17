const http = require('http');
const fs = require('fs');
const bound = 'smw60-smw60-smw60';
let body = `--${bound}\r\n`;
body += 'Content-Disposition:form-data; name="file"; filename="chernika.png"\r\n';
body += 'Content-Type:application/octet-stream\r\n\r\n';
const options = {
    host: 'localhost',
    port: 5000,
    path: '/task7',
    method: 'POST',
    headers: {'Content-Type':`multipart/form-data; boundary=${bound}`}
};

const req = http.request(options, (res)=>{
    let data = '';
    res.on('data', (chunk)=>{data +=chunk;});
    res.on('end', ()=>{console.log('http.response: end: length body = ', Buffer.byteLength(data)); });
});
req.on('error', (err)=>{
    console.log('http.request: error: ', err);
});
req.write(body);
let stream = new fs.ReadStream('D:/University/Node.js/Lab9/image/chernika.png');
stream.on('data', (chunk) =>{req.write(chunk); console.log(Buffer.byteLength(chunk))});
stream.on('end', ()=>{req.end(`\r\n--${bound}--\r\n`);});