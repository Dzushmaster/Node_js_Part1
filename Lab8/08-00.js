const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require('querystring');
const parseString = require('xml2js').parseString;
const xmlbuilder = require("xmlbuilder");
const mp = require("multiparty");
var k = 0;
var s = '';
const server = http.createServer();
let GET_Handler = (req, res)=>{
    let q = url.parse(req.url, true);
    let path = q.pathname.split('/');
    switch(path[1]){
        case 'connection':
            setKeepAliveParam(res, q);
            break;
        case 'headers':
            writeHeaders(req, res);
            break;
        case 'parameter':
            if(path[2] != undefined && path[3] != undefined)
                writeParamsFromURl(res, q);
            else
                writeParameters(res, q);
            break;
        case 'close':
            closeServer(res, server);
            break;
        case 'socket':
            writeSocketInfo(req, res);
            break;
        case 'req-data':
            reqData(req, res);
            break;
        case 'resp-status':
            setStatus(res, q);
            break;
        case 'formparameter':
            writeFormparameter(req, res);
            break;
        case 'files':
            if(path[2] != undefined)    
                writeFileByName(res, path[2]);
            else
                writeNumFiles(res);
            break;
        case 'upload':
            uploadFile(req, res);
            break;
        default:
            writeHTTP404(res);
            break;
    }
};
let POST_Handler = (req, res)=>{
    let q = url.parse(req.url, true);
    let path = q.pathname.split('/');
    switch(path[1]){
        case 'formparameter':
            writeFormparameter(req, res);
            break;
        case 'json':
            writeJson(req, res);
            break;
        case 'xml':
            writeXml(req, res);
            break;
        case 'upload':
            uploadFile(req, res);
            break;
        default:
            writeHTTP404(res);
            break;
    }
}
let writeHTTP404 = (res)=>{
    res.statusCode = 404;
    res.statusMessage = "Resource not allowed";
    res.end('Resource not allowed');
};
let httpHandle = (req, res)=>{
  if(req.method === 'GET')
    GET_Handler(req, res);
  else if(req.method === 'POST')
    POST_Handler(req, res);
  else
    wrtieHTTP405(res);
};

let setKeepAliveParam = (res, q)=>{
    let time = Number.parseInt(q.query['set']);
    if(!isNaN(time))
        server.keepAliveTimeout = time;
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    res.end(`server keepAliveTimeout = ${server.keepAliveTimeout}`);
};
let writeHeaders = (req, res) => {
    let allHeaders = 'Req headers:<br/>';
    res.setHeader('D-author','POIT, BSTU, dwb@bel.by');
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    for(key in req.headers)
        allHeaders +=`request header ${key}: ${req.headers[key]}<br/>`;
    const resHeaders = res.getHeaders();
    allHeaders +='<br/>Res headers:<br/>';
    for(key in resHeaders)
        allHeaders += `response header ${key}: ${resHeaders[key]}<br/>`;
    res.end(allHeaders);
};
let  writeParameters = (res, q) => {
    let x = Number.parseInt(q.query['x']);
    let y = Number.parseInt(q.query['y']);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    if(!isNaN(x) && !isNaN(y)){
        let result = `x + y = ${x + y}<br/>x - y = ${x - y}<br/>x * y = ${x * y}<br/>x / y = ${x / y}`;   
        res.end(result);
    }
    else
        res.end("Error: x or y is not a number");
};
let writeParamsFromURl = (res, q)=>{
    let result = decodeURI(q.pathname).split('/');
    let x = Number.parseInt(result[2]);
    let y = Number.parseInt(result[3]);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    if(!isNaN(x) && !isNaN(y))
        result = `x + y = ${x + y}<br/>x - y = ${x - y}<br/>x * y = ${x * y}<br/>x / y = ${x / y}`;
    else
        result = 'Error: x or y is not a number = ' + q.pathname;
    res.end(result);
};
let closeServer = (res, server)=>{
    setTimeout(()=>{
        res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
        res.end('Server will close in 10 seconds');
        server.close();
    }, 10000);
}
let writeSocketInfo = (req, res)=>{
    let socketInfo = 'Socket info:<br/>';
    socketInfo += 'socket.localAddress = ' + req.socket.localAddress + '<br/>';
    socketInfo += 'socket.localPort = ' + req.socket.localPort + '<br/>';
    socketInfo += 'socket.remoteAddress = ' + req.socket.remoteAddress + '<br/>';
    socketInfo += 'socket.remotePort = ' + req.socket.remotePort + '<br/>';
    res.writeHead(200, {'Content-Type':'text/html; charsetr=utf-8'});
    res.end(socketInfo);
};
let reqData = (req, res)=>{
    console.log(`request url: ${req.url}, # `, ++k);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    let buf = '';
    req.on('data', (data)=>{console.log('request.on(data) = ', data.length); buf+=data;});
    req.on('end', ()=>{console.log('request.on(end) = ', buf.length)});

    res.write('<h2>Http-server</h2>');
    s+= `url = ${req.url}, request/response # ${k}<br/>`;
    s+= `\n\n-------------------------------------------------------------------------------------------\n\n`;
    res.end(s);
};
let setStatus = (res, q)=>{
    let code = Number.parseInt(q.query['code']);
    let status = q.query['mess'];
    if(!isNaN(code) && status.length!=0)
    {
        res.statusCode = code;
        res.statusMessage = status;
        res.end(`Status: ${code} -> ${status}`);
    }
    else
        res.end(`Error: bad code = ${code} or status = ${status}`);
};

let writeFormparameter = (req, res)=>{
    if(req.method === 'GET')
    {
        fs.readFile("index.html", (err, data)=>{
            if(err){
                console.log("Error: can't find file\n");
                res.writeHead(400, {});
                res.end("Error: can't find file<br/>");
                return;
            }
            res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            res.write(data)
        });
    }
    else if(req.method === 'POST')
    {
        let result = '';
        req.on('data', (data)=>{
            result+=data;
        });
        req.on('end', ()=>{
            result+= '<br/>';
            let q = qs.parse(result);
            console.log(q.Length);
            for(let k in q)
                result+= `${k} = ${q[k]}<br/>`;
            res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            res.end(`Params:<br/>${result}`);
        });
    }
};
let writeJson = (req, res)=>{
    /*
    {
        "__comment": "Response 8/10",
        "x": 1,
        "y": 2,
        "s": "Message",
        "m":["a","b","c","d"],
        "o":{"surname":"Kaminsky", "name":"Dmitry"} 
    }
    */
    let result = '';
    req.on('data',(data)=>{
        result+=data;
    });
    req.on('end',()=>{
        let json = JSON.parse(result);
        let resultJson = {};
        resultJson['__comment'] = 'Response. Lab 8/10';
        resultJson['x_plus_y'] = Number.parseInt(json.x) + Number.parseInt(json.y);
        resultJson['Concatination_s_0'] = json.s + ': ' + json.o.surname + ', ' + json.o.name;
        resultJson['Length_m'] = Array.isArray(json.m)? json.m.length : 0;
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(resultJson));
    });
};
let writeXml = (req, res)=>{
    /*
    <request id = "28">
    <x value = "1"/>
    <x value = "2"/>
    <m value = "a"/>
    <m value = "b"/>
    <m value = "c"/>
    </request>
    */
    let xml = "";
    req.on('data', (data)=>{
        xml +=data;
    });
    req.on('end', ()=>{
        parseString(xml, (err, result)=>{
            if(err){
                console.log("Error: can't find xml file");
                res.writeHead(400, {});
                res.end("Error: can't find xml file");
                return;
            }
            let requestId = result.request.$.id;
            let sum = 0;
            let mess = "";
            result.request.x.forEach((item)=>{
                sum += Number.parseInt(item.$.value);
            });
            result.request.m.forEach((item)=>{
                mess += item.$.value;
            });
            let resultXml = 
            xmlbuilder.create('response')
            .att('id', Math.round(Math.random() * 50))
            .att('request', requestId);
            resultXml.ele('sum', {element: 'x', sum: `${sum}`});
            resultXml.ele('concat', {element: 'm', result: `${mess}`});
            res.writeHead(200, {'Content-Type':'text/html'});
            res.end(resultXml.toString({pretty:true}));
        });
    });
};
let writeNumFiles = (res)=>{
    fs.readdir('./static', (err, files)=>{
        if(err){
            res.writeHead(400,{});
            res.end("Error: can't find directory './static'");
        }
        res.setHeader("X-static-files-count", `${files.length}`);
        res.end();
    });
};
let writeFileByName = (res, filename)=>{
    fs.readFile(`./static/${filename}`, (err, data)=>{
        if(err){
            res.writeHead(404,{});
            res.end(`Error: file "${filename}" not found`);
        }
        else
        {
            res.writeHead(200, {'Content-Type':'multipart/form-data'});
            res.end(data);
        }
    })
};
let uploadFile = (req, res)=>{
    if(req.method === 'GET'){
        fs.readFile('upload.html', (err, data)=>{
            if(err){
                res.writeHead(404,{});
                res.end('File upload.html not found');
            }
            else{
                res.writeHead(200,{'Content-Type':'text/html'});
                res.end(data);
            }
        });
    }
    else if(req.method === 'POST'){
        let result = '';
        let form = new mp.Form({uploadDir:'./static'});
        form.on('field', (name, value)=>{
            console.log('----field----');
            console.log(name, value);
            result+=`<br/>---${name} = ${value}`;
        });
        form.on('file', (name, file)=>{
            console.log('---- file ----');
            console.log(name, file);
            result += `<br/>---${name} = ${file.originalFilename}: ${file.path}`;
        });
        form.on('error', (err)=>{
            console.log('----- err -----');
            console.log('err = ', err);
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.write('<h1>Form/Error</h1>');
            res.end();
        });
        form.on('close', ()=>{
            console.log('----- close -----');
            res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            res.write('<h1>Form</h1>');
            res.end(result);
        });
        form.parse(req);
    }
};
server.listen(5000, ()=>{console.log('server.listen(5000)')})
.on('error', (error)=>{console.log(`error: ${error.message}`)})
.on('request', httpHandle);