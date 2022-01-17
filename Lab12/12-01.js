const http = require('http');
const fs = require('fs');
const url = require('url');
const ws = require('ws');
const server = http.createServer();
const PATH_TO_FILE= './Files/StudentList.json';
function errorHandler(req, res, code, mess) {
    res.writeHead(500, 'yikes', { 'Content-Type': 'application/json; charset=utf-8'});
    res.end(`{"error": "${code}", "message": "${mess}"}`);
}
const httpHandler = (req, res)=>{
    fs.access(PATH_TO_FILE, fs.constants.F_OK, (err)=>{
        if(err) {
            errorHandler(req, res, 1, 'ошибка чтения файла ' + PATH_TO_FILE);
            return;
        }
    });
    switch(req.method)
    {
        case 'GET':
            GET_Handler(req, res);
            break;
        case 'POST':
            POST_Handler(req, res);
            break;
        case 'PUT':
            PUT_Handler(req, res);
            break;
        case 'DELETE':
            DELETE_Handler(req, res);
            break;
        default:
            errorHandler(req, res, 5, 'Неизвестный метод');
            break;
    }
}
const GET_Handler = (req, res)=>{
    let q = url.parse(req.url, true);
    let params = q.pathname.split('/');
    switch(q.pathname){
        case '/':
            GetStudList(req, res);
            break;
        case '/backup':
            console.log('backup');
            GetAllCopiesStudList(req, res);
            break;
        default:
            if(!Number.isNaN(params[1])){
                GetStudentById(req, res, q);
            }
            else
                errorHandler(req, res, 4, 'Неизвестный адрес');
            break;
    }
}
const POST_Handler = (req, res)=>{
    let q = url.parse(req.url, true);
    switch(q.pathname){
        case '/':
            AddNewStudent(req, res);
            break;
        case '/backup':
            CopyFile();
            res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            res.end('Success copy');
            break;
        default:
            errorHandler(req, res, 4, 'Неизвестный адрес');
            break;
    }
}
const PUT_Handler = (req, res)=>{
    let q = url.parse(req.url, true);
    if(q.pathname !== '/'){
        errorHandler(req, res, 4, 'Неизвестный адрес');
        return;
    }
    let result = '';
    req.on('data', (data)=>{
        result+=data;
    });
    req.on('end', ()=>{
        let json = JSON.parse(result);
        fs.readFile(PATH_TO_FILE, (e, data)=>{
            if(e)   { console.log('Error in PUT: ', e); return; }
            let jsonFromFile = JSON.parse(data);
            if(findStudentById(json['id'],jsonFromFile) != 'not found'){
                jsonFromFile[json['id'] - 1] = json;
                fs.writeFile(PATH_TO_FILE, JSON.stringify(jsonFromFile), (e)=>{});
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(result);
            }
            else{
                errorHandler(req, res, 2, 'студент с id равным ' + json['id'] + ' не найден');    
            }
        });
    });
};
const DELETE_Handler = (req, res)=>{
    const q = url.parse(req.url, true);
    const params = q.pathname.split('/');
    switch(q.pathname){
        case '/backup/' + params[2]:
            DeleteFileByDate(req, res, params[2]);
            break;
        default:
            if(!Number.isNaN(params[1])){
                fs.readFile(PATH_TO_FILE, (e, data)=>{
                if(e){
                    errorHandler(req, res, 1, 'ошибка чтения файла ' + PATH_TO_FILE);
                    return;
                }
                let jsonFromFile = JSON.parse(data);
                let arrayAfterDelete = DeleteStudent(Number.parseInt(params[1]),jsonFromFile);
                if(arrayAfterDelete == 0){
                    errorHandler(req, res, 2, 'студент с id равным ' + params[1] + ' не найден');    
                    return;
                }
                fs.writeFile(PATH_TO_FILE, JSON.stringify(jsonFromFile), (e)=>{});
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(JSON.stringify(arrayAfterDelete));
                });
            }
            else
                errorHandler(req, res, 4, 'Неизвестный адрес');
            break;
    }
}
const GetStudList = (req, res)=>{
    fs.readFile(PATH_TO_FILE, (e, data)=>{
        if(e) errorHandler(req, res, 2, 'студент с id равным ' + id + ' не найден');    
        else {
            res.writeHead(200, {'Content-Type':'application/json'});
            res.end(data);
        }
    });
};
const GetStudentById = (req, res, q)=>{
    let id = q.pathname.split('/');
    fs.readFile(PATH_TO_FILE, (e, data)=>{
        if(e) console.log('Error GetStudentById: ', e);
        else{
            let json = JSON.parse(data);
            for(let i = 0; i < json.length; i++){
                if(json[i].id == id[1]){
                    res.writeHead(200, {'Content-Type':'application/json'});
                    res.end(JSON.stringify(json[i]));
                    return;
                }
            }
            errorHandler(req, res, 2, 'студент с id равным ' + id + ' не найден');    
        }
    });
};
const GetAllCopiesStudList = (req, res)=>{
    fs.readdir('./Files', {withFileTypes:true}, (e, files)=>{
        if(e) errorHandler(req, res, 6, 'Ошибочный адрес папки');    
        else{
            let regex = new RegExp('\w*StudentList.json');
            res.writeHead(200, {"Content-Type":"application/json"});
            files.forEach(element => {
                if(regex.test(element.name)){
                    res.write(JSON.stringify(element));
                }
            });
            res.end();
        }
    });
};
const AddNewStudent = (req, res)=>{
    let result = '';
    req.on('data', (data)=>{
        result+=data;
    });
    req.on('end', ()=>{
        let json = JSON.parse(result);
        fs.readFile(PATH_TO_FILE, (e, data)=>{
            if(e){
                errorHandler(req, res, 1, 'ошибка чтения файла');    
                return;
            }
            let jsonFromFile = JSON.parse(data);
            if(!checkId(json['id'], jsonFromFile)){
                jsonFromFile[jsonFromFile.length] = json;
                fs.writeFile(PATH_TO_FILE, JSON.stringify(jsonFromFile), (e)=>{});
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(result);
            }
            else{
                errorHandler(req, res, 3, 'студент с id равным ' + json['id'] + ' уже есть');    
            }
        });
    });    
};
const CopyFile = ()=>{
    setTimeout(()=>{
        fs.copyFile(PATH_TO_FILE, createName(new Date()), (e)=>{if(e) console.log('Error in copy: ',e);});
    }, 2000);
};
const DeleteStudent = (id, jsonFromFile)=>{
    for(let i = 0; i<jsonFromFile.length; i++){
        if(jsonFromFile[i]['id'] == id)
            return jsonFromFile.splice(i,1);
    }
    return 0;
};
const DeleteFileByDate = (req, res ,date)=>{
    fs.readdir('./Files', {withFileTypes:false}, (err, files)=>{
        if(err) errorHandler(req, res, 6, 'Указанная папка не найдена');    
        else{
            let fileDate = '';
            console.log('date: ',date);
            files.forEach(element => {
                fileDate = element.substr(0,8);
                if(Number.parseInt(fileDate) > Number.parseInt(date)){
                    fs.unlink('./Files/'+element, (e)=>{
                        if(e) errorHandler(req, res, 7, 'ошибка удаления файла'); 
                        else console.log('File deleted');
                    });
                }
            });
        } 
    });

};
const findStudentById = (id, jsonFromFile)=>{
    for(let i = 0; i<jsonFromFile.length; i++){
        if(jsonFromFile[i]['id'] == id)
            return id;
    }
    return 'not found';
};
const checkId = (id, jsonFromFile)=>{
    for(let i = 0; i<jsonFromFile.length; i++){
        if(jsonFromFile[i]['id'] == id)
            return -1;
    }
    return 0;
};
const createName = (date)=>{
    return './Files/' + date.getFullYear() + (date.getMonth()+1) + date.getDate() + date.getHours() + date.getSeconds() + '_StudentList.json'; 
};
server.listen(4000, ()=>{console.log('http:4000');})
.on('request', httpHandler)
.on('error', (e)=>{ console.log("Server error: ", e);});
let wsServer = new ws.Server({port:5000, host:'localhost', path:'/broadcast'});
wsServer.on('connection', (ws)=>{
    fs.watch(PATH_TO_FILE, {encoding:'buffer'}, (eventType, filename)=>{
        if(eventType === 'change'){
            wsServer.clients.forEach((client)=>{
                if(client.readyState === ws.OPEN)
                    client.send(`File ${filename} was modified`);
            });
            return;
        }
    })
    fs.readdir('./Files', (err,files)=>{
        for(let i = 0; i<files.length; i++){
            fs.watch(('./Files/'+files[i]), {encoding:'buffer'}, (eventType, filename)=>{
                if(eventType ==='change'){
                    wsServer.clients.forEach((client)=>{
                        if(client.readyState === ws.OPEN)
                            client.send(`File ${filename} was modified`);
                    })
                    return;
                }
            });
        }
        console.log(files.length);
    });
});
wsServer.on('error', (e)=>{console.log('ws server error',e);});
console.log(`WS server: host: ${wsServer.options.host}, post: ${wsServer.options.port}, path:${wsServer.options.path}`);