const http = require('http');
const xmlbuilder = require('xmlbuilder');
const parseString = require('xml2js').parseString;
let xmlDoc = xmlbuilder.create('request').att('id', 45);
xmlDoc.element('x').att('value', 1);
xmlDoc.element('x').att('value', 2);
xmlDoc.element('x').att('value', 3);
xmlDoc.element('m').att('value', 'a');
xmlDoc.element('m').att('value', 'b');
xmlDoc.element('m').att('value', 'c');

let options = {
    host:'localhost',
    path:'/task5',
    port:5000,
    method:'POST',
    headers:{'content-type':'text/html','accept':'text/html'}
};
const req = http.request(options, (res)=>{
    let data = '';
    res.on('data',(chunk)=>{
        data+=chunk;
    });
    res.on('end',()=>{
        console.log('http.response: end: body = ', data);
        parseString(data, (err, str)=>{
            if(err) console.log('xml parse error');
            else{
                console.log(`Response id: ${str.response.$.id}`);
                console.log(`Request id: ${str.response.$.request}`);
                str.response.sum.forEach((item)=>{
                    console.log(`Sum element = ${item.$.element} result = ${item.$.sum}`);
                });
                str.response.concat.forEach((item)=>{
                    console.log(`Concat string = ${item.$.element} result = ${item.$.sum}`);
                });
            }
        });
    })
});
req.on('error', (e)=>{console.log('http.request: error:', e.message);});
req.end(xmlDoc.toString({pretty:true}));