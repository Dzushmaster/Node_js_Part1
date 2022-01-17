const http = require("http");
const url = require('url');
const qs = require('querystring');
const fs = require('fs');
const parseString = require("xml2js").parseString;
const xmlbuilder = require('xmlbuilder');
const mp = require('multiparty');
const getHandler = (req, res)=>{
    let q = url.parse(req.url, true);
    switch(q.pathname){
        case '/task1':
            res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
            res.end('<h1>task1</h1>');
            break;
        case '/task2':
            res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
            res.end(`First param: ${q.query['x']} - Second param: ${q.query['y']}`);
            console.log(`First param: ${q.query['x']} - Second param: ${q.query['y']}`);
            break;
        case '/task8':
            sendFile(res);
            break;
        default:
            res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
            res.end('Dont know this method');
    }
};
const postHandler = (req, res)=>{
    let q = url.parse(req.url, true);
    switch(q.pathname){
        case '/task3':
            ParamsResponse(req, res);
            break;
        case '/task4':
            JSONResponse(req, res);
            break;
        case '/task5':
            XMLResponse(req, res);
            break;
        case '/task6':
            TxtResponse(req, res);
            break;
        case '/task7':
            ImageResponse(req, res);
            break;
        default:
            res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
            res.end('Dont know this method');
    }
};
const httpHandler = (req, res)=>{
    switch(req.method)
    {
        case 'GET':
            getHandler(req, res);
            break;
        case 'POST':
            postHandler(req, res);    
            break;
        default:
            res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
            res.end('Dont know this method');
    }    
};
const ParamsResponse = (req, res)=>{
    let result = '';
    req.on('data', (data)=>{
        result+=data;
    });
    req.on('end', ()=>{
        result+= '<br/>';
        let q = qs.parse(result);
        for(let k in q)
            result+= `${k} = ${q[k]}<br/>`;
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        res.end(`Params:<br/>${result}`);
    });
};
const JSONResponse = (req, res)=>{
    let result = '';
    req.on('data', (chunk)=>{
        result+=chunk;
    });
    req.on('end', ()=>{
        let json = JSON.parse(result);
        let resultJson = {};
        resultJson['__comment'] = 'Response. Lab 9/4';
        resultJson['x_plus_y'] = Number.parseInt(json.x) + Number.parseInt(json.y);
        resultJson['Concatination_s_0'] = json.s + ': ' + json.o.surname + ', ' + json.o.name;
        resultJson['Length_m'] = Array.isArray(json.m)? json.m.length : 0;
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(resultJson));
    })

};
const XMLResponse = (req, res)=>{
    let xmlstring = '';
    req.on('data', (data)=>{
        xmlstring+= data;
    });
    console.log(xmlstring);
    req.on('end', ()=>{
        parseString(xmlstring, (err, result)=>{
           if(err){
               console.log('Error read xml');
               res.writeHead(400, {});
               res.end('XML parse error');
               return;
           }
           const requestId = result.request.$.id;
           var sum = 0;
           var mess = '';
           result.request.x.forEach((item)=>{
               sum += Number.parseInt(item.$.value);
           });
           result.request.m.forEach((item)=>{
               mess += item.$.value;
           });
           var resXml = xmlbuilder
           .create('response')
           .att('id', Math.round(Math.random() * 50))
           .att('request', requestId);
           resXml.ele('sum', {element: 'x', sum: `${sum}`});
           resXml.ele('concat', {element: 'm', sum: `${mess}`});
           res.writeHead(200, {'Content-Type':'text/xml'});
           res.end(resXml.toString({pretty:true}));
        });
    });
};
const TxtResponse = (req, res)=>{
    let result = '';
    req.on('data', (chunk)=>{
        result+=chunk;
    });
    req.on('end', ()=>{
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        res.end(`\n\n${result}`);
    })
};
const ImageResponse = (req, res)=>{
    // let body = '';
    // req.on('data', (chunk) =>{
    //     body += chunk.toString();
    // });
    // req.on('end', ()=>{res.writeHead(200, {'Content-Type':'application/octet-stream'}); res.end(body)});
    let result = "";
    const form = new mp.Form({ uploadDir: "./static" });
    form.on("field", (name, value) => {
      result += `<br/>---${name}=${value}`;
    });
    form.on("file", (name, file) => {
      result += `<br/>---${name}=${file.originalFilename}: ${file.path}`;
    });
    form.on("error", (err) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("<h2>Form error</h2>");
    });
    form.on("close", () => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write("<h2>Form</h2>");
      res.end(result);
    });
    form.parse(req);
};
const sendFile = (res)=>{
    res.end(fs.readFileSync("myFile.txt"));
}
server = http.createServer();
server.listen(5000, ()=>{console.log('server.listen(5000)')})
.on('error', (error)=>{console.log(`error: ${error.message}`)})
.on('request', httpHandler);
/*
    let result = '';
    const form = new multiparty.Form({uploadDir:"./image"});
    form.on('filed', (name, value)=>{
        result += `--- ${name} = ${value} ---`;
    });
    form.on('file', (name, file)=>{
        result += `--- ${name} = ${file.originalFilename}: ${file.path}`;
    });
    form.on('error', (err)=>{
        res.writeHead(200, {'Content-Type':'text/html'});
        res.write('Server: error - ', err);
    });
    form.on('close', ()=>{
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('Form\n');
        res.end('result');
    });
    form.parse(result);
*/