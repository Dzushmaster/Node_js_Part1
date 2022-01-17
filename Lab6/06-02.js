var nodemailer = require("nodemailer");
var fs = require('fs');
var http = require('http');
var {parse} = require('querystring');
const server = http.createServer().listen(5000);
console.log("http://localhost:5000");
server.on("request", (request, response)=>{
    if(request.method == 'GET'){
        let html = fs.readFileSync('./06-02.html');
        response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        response.end(html);
    }
    else if(request.method == 'POST'){
       let body = '';
       request.on('data', chunk =>{
           body += chunk.toString();
       });
       request.on('end', ()=>{
           console.log(body);
           let params = parse(body);
           const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth:{
                    user:params.Sender,
                    pass: params.passwordSender
                }
           });
           const options = {
               from: params.Sender,
               to: params.Recepient,
               subject: "Lab 6 mail",
               text: params.msg
           };
           transporter.sendMail(options, (err, info) =>{
               if(err){
                   console.log(err);
               }else{
                   console.log(info);
               }
           });
           response.writeHead(200, {"Content-Type": "text/html; charset = utf-8"})
           response.end('ok');
       });
    }
});

