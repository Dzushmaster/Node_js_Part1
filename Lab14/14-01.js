const FACULT = 'faculties';
const PULP = 'pulpits';
const SUB = 'subjects';
const AUD_TYPE = 'auditoriumstypes';
const AUD = 'auditoriums';
const FILE_PATH = './resource/index.html';

const http = require('http');
const fs = require('fs');
const url = require('url');
const server = http.createServer();
const Db = require('./db');
let DB = new Db();
function errorHandler(res, code, mess) {
    res.writeHead(500, 'yikes', { 'Content-Type': 'application/json; charset=utf-8'});
    res.end(`{"error": "${code}", "message": "${mess}"}`);
}

const getHandler = (req, res) =>{
    const q = url.parse(req.url, true).pathname.split('/');
    if(q[1] == 'api')
    {
        switch(q[2])
        {
            case FACULT:
                DB.getFacult().then(result =>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(result.recordset));
                }).catch(error=>{ errorHandler(res, 402, 'Error in getFacult');});
                break;
            case PULP:
                DB.getPulp().then(result =>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(result.recordset));
                }).catch(error=>{ errorHandler(res, 402, error);});
                break;
            case SUB:
                DB.getSub().then(result =>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(result.recordset));
                }).catch(error=>{ errorHandler(res, 402, 'Error in getFacult');});
                break;
            case AUD_TYPE:
                DB.getAud_Type().then(result =>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(result.recordset));
                }).catch(error=>{ errorHandler(res, 402, 'Error in getFacult');});
                break;
            case AUD:
                DB.getAud().then(result =>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(result.recordset));
                }).catch(error=>{ errorHandler(res, 402, 'Error in getFacult');});
                break;
            default: 
                errorHandler(res, 401, `Error: invalid url ${req.url}`);
                break;
        }
    }
    else if(q[1].length == 0)
    {
        res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'})
        res.end(fs.readFileSync(FILE_PATH));
    }
    else
        errorHandler(res, 401, `Invalid url: ${req.url}`);
}
const postHandler = (req, res)=>{
    const q = url.parse(req.url, true).pathname.split('/');
    if(q[1] == 'api')
    {
        switch(q[2])
        {
            case FACULT:
                insertFaculty(req, res);
                break;
            case PULP:
                insertPulp(req, res);
                break;
            case SUB:
                insertSub(req, res);
                break;
            case AUD_TYPE:
                insertAud_TP(req, res);
                break;
            case AUD:
                insertAud(req, res);
                break;
            default: 
                errorHandler(res, 401, `Error: invalid url ${req.url}`);
                break;
        }
    }
    else
        errorHandler(401, `Invalid url: ${req.url}`);
}
const putHandler = (req, res)=>{
    const q = url.parse(req.url, true).pathname.split('/');
    if(q[1] == 'api')
    {
        switch(q[2])
        {
            case FACULT:
                updateFaculty(req, res);
                break;
            case PULP:
                updatePulp(req, res);
                break;
            case SUB:
                updateSub(req, res);
                break;
            case AUD_TYPE:
                updateAud_TP(req, res);
                break;
            case AUD:
                updateAud(req, res);
                break;
            default: 
                errorHandler(401, `Error: invalid url ${req.url}`);
                break;
        }
    }
    else
        errorHandler(401, `Invalid url: ${req.url}`);
}
const delHandler = (req, res)=>{
    const q = url.parse(req.url, true).pathname.split('/');
    if(q[1] == 'api')
    {
        switch(q[2])
        {
            case FACULT:
                delFacult(req, res, q);
                break;
            case PULP:
                delPulp(req, res, q);
                break;
            case SUB:
                delSub(req, res, q);
                break;
            case AUD_TYPE:
                delAud_TP(req, res, q);
                break;
            case AUD:
                delAud(req, res, q);
                break;
            default: 
                errorHandler(401, `Error: invalid url ${req.url}`);
                break;
        }
    }
    else
        errorHandler(401, `Invalid url: ${req.url}`);
}
const httpHandler = (req, res)=>{
    switch(req.method){
        case 'GET':
            getHandler(req, res);
            break;
        case 'POST':
            postHandler(req, res);
            break;
        case 'PUT':
            putHandler(req, res);
            break;
        case 'DELETE':
            delHandler(req, res);
            break;
        default:
            errorHandler(res, 400, `Invalid method: ${req.method}`);
    }
}

const insertFaculty = (req, res)=>{
    let result = '';
    req.on('data', chunk=>{
        result += chunk;
    });
    req.on('end', (err)=>{
        if(err) errorHandler(res, 402, `Error in insertFaculty: ${err.message}`)
        else{
            if(result.length == 0){
                errorHandler(res, 403, 'Write text in body');
                return;
            }
            let jsonData = JSON.parse(result);
            console.log(JSON.stringify(jsonData));
            res.writeHead(200, {'Content-Type':'application/json'});
            for(let i = 0; i<jsonData.length - 1; i++){
                DB.postFacult(jsonData[i]['faculty'], jsonData[i]['faculty_name']).
                then(records =>{
                    res.write(JSON.stringify(jsonData[i]));
                }).catch(error => { errorHandler(res, 404, `Error in insertFacult : ${error.message}`);})
            }
            DB.postFacult(jsonData[jsonData.length - 1]['faculty'], jsonData[jsonData.length - 1]['faculty_name']).
            then(records =>{
                res.end(JSON.stringify(jsonData[jsonData.length - 1]));
            }).catch(error => { errorHandler(res, 404, `Error in insertFacult : ${error.message}`);})

        }
    })
}

const insertPulp = (req, res)=>{
    let result = '';
    req.on('data', chunk=>{
        result += chunk;
    });
    req.on('end', (err)=>{
        if(err) errorHandler(res, 402, `Error in insertFaculty: ${err.message}`)
        else{
            if(result.length == 0){
                errorHandler(res, 403, 'Write text in body');
                return;
            }
            let jsonData = JSON.parse(result);
            console.log(JSON.stringify(jsonData));
            res.writeHead(200, {'Content-Type':'application/json'});
            DB.postPulp(jsonData['pulpit'], jsonData['pulpit_name'], jsonData['faculty']).
            then(records =>{
                res.end(JSON.stringify(jsonData));
            }).catch(error => { errorHandler(res, 404, `Error in insertFacult : ${error.message}`);})

        }
    })
}

const insertSub = (req, res)=>{
    let result = '';
    req.on('data', chunk=>{
        result += chunk;
    });
    req.on('end', (err)=>{
        if(err) errorHandler(res, 402, `Error in insertFaculty: ${err.message}`)
        else{
            if(result.length == 0){
                errorHandler(res, 403, 'Write text in body');
                return;
            }
            let jsonData = JSON.parse(result);
            console.log(JSON.stringify(jsonData));
            res.writeHead(200, {'Content-Type':'application/json'});
            DB.postSub(jsonData[0]['subject'], jsonData[0]['subject_name'], jsonData[0]['pulpit']).
            then(records =>{
                res.end(JSON.stringify(jsonData[jsonData.length - 1]));
            }).catch(error => { errorHandler(res, 404, `Error in insertFacult : ${error.message}`);})

        }
    })
}

const insertAud_TP = (req, res)=>{
    let result = '';
    req.on('data', chunk=>{
        result += chunk;
    });
    req.on('end', (err)=>{
        if(err) errorHandler(res, 402, `Error in insertFaculty: ${err.message}`)
        else{
            if(result.length == 0){
                errorHandler(res, 403, 'Write text in body');
                return;
            }
            let jsonData = JSON.parse(result);
            console.log(JSON.stringify(jsonData));
            res.writeHead(200, {'Content-Type':'application/json'});
            DB.postAud_Type(jsonData[0]['auditorium_type'], jsonData[0]['auditorium_typename']).
            then(records =>{
                res.end(JSON.stringify(jsonData[0]));
            }).catch(error => { errorHandler(res, 404, `Error in insertFacult : ${error.message}`);})

        }
    })
}

const insertAud = (req, res)=>{
    let result = '';
    req.on('data', chunk=>{
        result += chunk;
    });
    req.on('end', (err)=>{
        if(err) errorHandler(res, 402, `Error in insertFaculty: ${err.message}`)
        else{
            if(result.length == 0){
                errorHandler(res, 403, 'Write text in body');
                return;
            }
            let jsonData = JSON.parse(result);
            console.log(JSON.stringify(jsonData));
            res.writeHead(200, {'Content-Type':'application/json'});
            DB.postAud(jsonData[0]['auditorium'], jsonData[0]['auditorium_name'], jsonData[0]['auditorium_capacity'], jsonData[0]['auditorium_type']).
            then(records =>{
                res.end(JSON.stringify(jsonData[0]));
            }).catch(error => { errorHandler(res, 404, `Error in insertFacult : ${error.message}`);})

        }
    })
}


const updateFaculty = (req, res)=>{
    let result = '';
    req.on('data', chunk=>{
        result += chunk;
    });
    req.on('end', (err)=>{
        if(err) errorHandler(res, 402, `Error in updateFaculty: ${err.message}`)
        else{
            if(result.length == 0){
                errorHandler(res, 403, 'Write text in body');
                return;
            }
            let jsonData = JSON.parse(result);
            console.log(JSON.stringify(jsonData));
            res.writeHead(200, {'Content-Type':'application/json'});
            DB.putFacult(jsonData['faculty'], jsonData['faculty_name']).
            then(records =>{
                res.end(JSON.stringify(jsonData));
            }).catch(error => { errorHandler(res, 404, `Error in updateFaculty : ${error.message}`);})

        }
    })
}

const updatePulp = (req, res)=>{
    let result = '';
    req.on('data', chunk=>{
        result += chunk;
    });
    req.on('end', (err)=>{
        if(err) errorHandler(res, 402, `Error in updatePulpit: ${err.message}`)
        else{
            if(result.length == 0){
                errorHandler(res, 403, 'Write text in body');
                return;
            }
            let jsonData = JSON.parse(result);
            console.log(JSON.stringify(jsonData));
            res.writeHead(200, {'Content-Type':'application/json'});
            DB.putPulp(jsonData['pulpit'], jsonData['pulpit_name'], jsonData['faculty']).
            then(records =>{
                res.end(JSON.stringify(jsonData));
            }).catch(error => { errorHandler(res, 404, `Error in updatePulpit : ${error.message}`);})

        }
    })
}

const updateSub = (req, res)=>{
    let result = '';
    req.on('data', chunk=>{
        result += chunk;
    });
    req.on('end', (err)=>{
        if(err) errorHandler(res, 402, `Error in updateSub: ${err.message}`)
        else{
            if(result.length == 0){
                errorHandler(res, 403, 'Write text in body');
                return;
            }
            let jsonData = JSON.parse(result);
            console.log(JSON.stringify(jsonData));
            res.writeHead(200, {'Content-Type':'application/json'});
            DB.putSub(jsonData['subject'], jsonData['subject_name'], jsonData['pulpit']).
            then(records =>{
                res.end(JSON.stringify(jsonData));
            }).catch(error => { errorHandler(res, 404, `Error in updateFacult : ${error.message}`);})

        }
    })
}

const updateAud_TP = (req, res)=>{
    let result = '';
    req.on('data', chunk=>{
        result += chunk;
    });
    req.on('end', (err)=>{
        if(err) errorHandler(res, 402, `Error in updateAud_TP: ${err.message}`)
        else{
            if(result.length == 0){
                errorHandler(res, 403, 'Write text in body');
                return;
            }
            let jsonData = JSON.parse(result);
            console.log(JSON.stringify(jsonData));
            res.writeHead(200, {'Content-Type':'application/json'});
            DB.putAud_Type(jsonData['auditorium_type'], jsonData['auditorium_typename']).
            then(records =>{
                res.end(JSON.stringify(jsonData));
            }).catch(error => { errorHandler(res, 404, `Error in updateFacult : ${error.message}`);})

        }
    })
}

const updateAud = (req, res)=>{
    let result = '';
    req.on('data', chunk=>{
        result += chunk;
    });
    req.on('end', (err)=>{
        if(err) errorHandler(res, 402, `Error in updateAud: ${err.message}`)
        else{
            if(result.length == 0){
                errorHandler(res, 403, 'Write text in body');
                return;
            }
            let jsonData = JSON.parse(result);
            console.log(jsonData[0]['auditorium_name']);
            res.writeHead(200, {'Content-Type':'application/json'});
            DB.putAud(jsonData[0]['auditorium'], jsonData[0]['auditorium_name'], jsonData[0]['auditorium_capacity'], jsonData[0]['auditorium_type']).
            then(records =>{
                res.end(JSON.stringify(jsonData[0]));
            }).catch(error => { errorHandler(res, 404, `Error in updateFacult : ${error.message}`);})

        }
    })
}


const delFacult = (req, res, q)=>{
    res.writeHead(200, 'application/json');
    const xyz = decodeURI(q[3]);
    DB.findFacult(xyz).then(result =>{
        if(result.recordset.length == 0){
            errorHandler(res, 405, `Error: delFacult can't find this faculty '${xyz}'`);
            return;
        }
    }).catch(err => { errorHandler(res, 405, err)});
    DB.deleteFaculty(xyz).then(records =>{
        res.write();
    }).catch(err =>{ errorHandler(res, 405, `Error delFacult : ${err}`)});
}

const delPulp = (req, res, q)=>{
    res.writeHead(200, 'application/json');
    const xyz = decodeURI(q[3]);
    DB.findPulp(xyz).then(result =>{
        if(result.recordset.length == 0){
            errorHandler(res, 405, `Error: delFacult can't find this faculty '${xyz}'`);
            return;
        }
}).catch(err => { errorHandler(res, 405, err)});
    DB.deletePulp(xyz).then(rec =>{
        res.end();
    }).catch(err =>{ errorHandler(res, 405, `Error delPulp : ${err}`)});
}

const delSub = (req, res, q)=>{
    res.writeHead(200, 'application/json');
    const xyz = decodeURI(q[3]);
    DB.findSub(xyz).then(result =>{
        if(result.recordset.length == 0){
            errorHandler(res, 405, `Error: delFacult can't find this faculty '${xyz}'`);
            return;
        }
    }).catch(err => { errorHandler(res, 405, err)});
    DB.deleteSub(xyz).then(rec =>{
        res.end();
    }).catch(err =>{ errorHandler(res, 405, `Error delSub : ${err}`)});
}

const delAud_TP = (req, res, q)=>{
    res.writeHead(200, 'application/json');
    const xyz = decodeURI(q[3]);
    DB.findAud_TP(xyz).then(result =>{
        if(result.recordset.length == 0){
            errorHandler(res, 405, `Error: delFacult can't find this faculty '${xyz}'`);
            return;
        }
    }).catch(err => { errorHandler(res, 405, err)});
    DB.deleteAud_Type(xyz).then(rec =>{
        res.end();
    }).catch(err =>{ errorHandler(res, 405, `Error delAud_TP : ${err}`)});
}

const delAud = (req, res, q)=>{
    res.writeHead(200, 'application/json');
    const xyz = decodeURI(q[3]);
    // DB.findAud(xyz).then(result =>{
    //     if(result.recordset.length == 0){
    //         errorHandler(res, 405, `Error: delFacult can't find this faculty '${xyz}'`);
    //         return;
    //     }
    // }).catch(err => { errorHandler(res, 405, err)});
    DB.deleteAud(xyz).then(rec =>{
        res.end();
    }).catch(err =>{ errorHandler(res, 405, `Error delAud : ${err}`)});
}


server.listen(4000, () => { console.log('Server on 4000:'); })
.on('request', httpHandler)
.on('error', (err)=> { console.log(err); });
