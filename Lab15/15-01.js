const MongoClient = require('mongodb').MongoClient;
const http = require('http');
const url = require('url');
const server = http.createServer();
const uri = "mongodb+srv://User:12345@bstu.hhw1n.mongodb.net/BSTU?retryWrites=true&w=majority";
const client = new MongoClient(uri);
function errorHandler(res, code, mess) {
    res.writeHead(500, 'yikes', { 'Content-Type': 'application/json; charset=utf-8'});
    res.end(`{"error": "${code}", "message": "${mess}"}`);
}
client.connect(err =>{
    if(err) console.log('MongoDB: error connection', err);
    else console.log('MongoDB: connect successfull');
});
const httpHandler = (req, res)=>{
    switch(req.method){
        case 'GET':
            GetHandler(req, res);
        break;
        case 'POST':
            PostHandler(req, res);
        break;
        case 'PUT':
            PutHandler(req, res);
        break;
        case 'DELETE':
            DeleteHandler(req, res);
        break;
        default:
            errorHandler(res, 404, `httpHandler: undefined method ${req.method}`);
        break;
    }
}
const GetHandler = (req, res)=>{
    const cluster = url.parse(req.url, true).pathname.split('/')[2];
    if(cluster === 'faculties')
        GetListFacult(res);
    else if (cluster === 'pulpits')
        GetListPulp(res);
    else
        errorHandler(res, 404, `Undefined cluster: ${cluster}`);
};
async function PostHandler (req, res){
    const cluster = url.parse(req.url, true).pathname.split('/')[2];
    if(cluster === 'faculties')
        await InsertFacult(req, res);
    else if (cluster === 'pulpits')
        await InsertPulp(req, res);
    else
        await errorHandler(res, 404, `Undefined cluster: ${cluster}`);
};
async function PutHandler (req, res){
    const cluster = url.parse(req.url, true).pathname.split('/')[2];
    if(cluster === 'faculties')
    {
        await UpdFacult(req, res);
    }
    else if (cluster === 'pulpits')
        await UpdPulp(req, res);
    else
        errorHandler(res, 404, `Undefined cluster: ${cluster}`);
};
async function DeleteHandler (req, res){
    const cluster = url.parse(req.url, true).pathname.split('/')[2];
    const value = decodeURI(url.parse(req.url, true).pathname).split('/')[3];
    console.log(value);
    if(cluster === 'faculties' && value != undefined)
        await DelFacul(res, value);
    else if (cluster === 'pulpits' && value !=undefined)
        await DelPulp(res, value);
    else
        errorHandler(res, 404, `Undefined cluster: ${cluster}`);
};


async function GetListFacult(res){
    const collection = await client.db('BSTU').collection('faculty');
    const data = await collection.find({}, {projection:{faculty:1}}).toArray((err, docs)=>{
        if(err) console.log('Error geting item: ', err);
        else{
            res.writeHead(200, 'application/json');
            res.end(JSON.stringify(docs));        
        }
    });   
}
async function GetListPulp(res){
    const collection = await client.db('BSTU').collection('pulpit');
    const data = await collection.find({}, {faculty:1}).toArray((err, docs)=>{
        if(err) console.log('Error geting item: ', err);
        else{
            res.writeHead(200, 'application/json');
            res.end(JSON.stringify(docs));        
        }
    });   
}


async function InsertFacult(req, res){
    let result = '';
    await req.on('data', (data)=>{
        result += data;
    });
    await req.on('end', ()=>{
        let json = JSON.parse(result);
        let inputValue = [{faculty:'', faculty_name:''}];
        for(let k in json)
            inputValue[k] = {faculty: json[k]['faculty'], faculty_name: json[k]['faculty_name']};
        const collection = client.db('BSTU').collection('faculty');
        console.log(inputValue);
        try{
            if(inputValue.length === 1)
                insertValue = collection.insertOne(inputValue[0]);
            else
                insertValue = collection.insertMany(inputValue);
            res.writeHead(200, {'Content-Type':'application/json'});
            res.end(JSON.stringify(inputValue));    
        }
        catch(err){
            console.log(err);
            errorHandler(res, 400, 'Error: insert facult, write valid data');
        }    
    });
}
async function InsertPulp(req, res){
    let result = '';
    await req.on('data', (data)=>{
        result += data;
    });
    await req.on('end', ()=>{
        let json = JSON.parse(result);
        let inputValue = [{pulpit:'', pulpit_name:'', faculty:''}];
        let insertValue;
        for(let k in json)
            inputValue[k] = {pulpit: json[k]['pulpit'], pulpit_name: json[k]['pulpit_name'], faculty: json[k]['faculty']};
        const collection = client.db('BSTU').collection('pulpit');
        try{
            if(inputValue.length === 1)
                insertValue = collection.insertOne(inputValue[0]);
            else
                insertValue = collection.insertMany(inputValue);
            res.writeHead(200, {'Content-Type':'application/json'});
            res.end(JSON.stringify(inputValue));    
        }
        catch(err){
            console.log(err);
            errorHandler(res, 400, 'Error: insert facult, write valid data');
        }    
    });
}


async function UpdFacult(req, res){
    let result = '';
    req.on('data', (data)=>{
        result += data;
        console.log(result);
    });
    req.on('end', ()=>{
        let json = JSON.parse(result);
        let inputValue = [{faculty:'', faculty_name:''}];
        let insertValue;
        for(let k in json)
            inputValue[k] = {faculty: json[k]['faculty'], faculty_name: json[k]['faculty_name']};
        const collection = client.db('BSTU').collection('faculty');
        const val1 = inputValue[0]['faculty'];
        const val2 = inputValue[0]['faculty_name'];
        try{
            insertValue = collection.findOneAndUpdate(
                { faculty: val1 },
                { $set: { faculty_name: val2 } }
            );
            res.writeHead(200, {'Content-Type':'application/json'});
            res.end(JSON.stringify(inputValue));
        }
        catch(err){
            console.log(err);
            errorHandler(res, 400, 'Error: insert facult, write valid data');
        }    
    });
}
async function UpdPulp(req, res){
    let result = '';
    await req.on('data', (data)=>{
        result += data;
    });
    await req.on('end', ()=>{
        let json = JSON.parse(result);
        let inputValue;
        for(let k in json)
            inputValue = [{pulpit: json[k]['pulpit'], pulpit_name: json[k]['pulpit_name'], faculty: json[k]['faculty']}];
        const collection = client.db('BSTU').collection('pulpit');
        let insertValue;
        try{
            insertValue = collection.findOneAndUpdate(
                { pulpit: inputValue[0]['pulpit'] },
                { $set: {
                    pulpit_name: inputValue[0]['pulpit_name'],
                    faculty: inputValue[0]['faculty']
                    }
                }
            );
            res.writeHead(200, {'Content-Type':'application/json'});
            res.end(JSON.stringify(inputValue));    
        }
        catch(err){
            console.log(err);
            errorHandler(res, 400, 'Error: insert facult, write valid data');
        }    
    });
}


async function DelFacul(res, value){
    const collection = client.db('BSTU').collection('faculty');
    let insertValue;
    try{
        insertValue = collection.findOneAndDelete({faculty:value});
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(insertValue));    
    }
    catch(err){
        errorHandler(res, 400, 'Error: insert facult, write valid data');
    }    
}
async function DelPulp(res, value){
    const collection = client.db('BSTU').collection('pulpit');
    let insertValue;
    try{
        insertValue = collection.findOneAndDelete({pulpit:value}, {returnDocument:"after"});
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(insertValue));    
    }
    catch(err){
        errorHandler(res, 400, 'Error: insert facult, write valid data');
    }

}


server.listen(3000, ()=>{ console.log('http:3000'); } )
.on('request', httpHandler)
.on('error', (err)=>{
    console.log('Server error: ' , err);
});
//[{"faculty":"ИЭФ","faculty_name":"Инженерно-экономический факульет"},