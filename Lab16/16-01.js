const http = require('http');
const {graphql, buildSchema} = require('graphql');
const schema = buildSchema(require('fs').readFileSync('./16.gql').toString());
const {DB} = require('./DB');
const resolver = require('./resolver');
const {Error400, Resp200, IsError} = require('./errors');
const server = http.createServer();

const context = DB((err, connect)=>{
    if(err) console.error('DB connection failed');
    else{
        console.log('DB connection established');
        server.listen(3000, ()=>{
            console.log('Server is running on 3000')
        })
        .on('error', (err)=>{ console.log('Error: ', err.code)})
        .on('request', httpHandler);
    }
});

const httpHandler = (req, res) =>{
    if(req.method === 'POST'){
        let result = '';
        req.on('data', (data)=>{ result+= data});
        req.on('end', ()=>{
            try{
                let obj = JSON.parse(result);
                console.log(obj);
                if(obj.query){
                    graphql(schema, obj.query, resolver, context, obj.variables ? obj.variables:{})
                    .then((result)=>{
                        new IsError(result)
                        .then((json)=>{ Error400(res, json)})
                        .else((json)=>{ Resp200(res, '', json)});
                    })
                }
                if(obj.mutation){
                    graphql(schema, obj.mutation, resolver, context, obj.variables? obj.variables :{})
                    .then((result)=> {
                        new IsError(result)
                        .then((json)=>{ Error400(res, json)})
                        .else((json)=>{ Resp200(res, '', json)});
                    })
                }
            }
            catch(e){
                Error400(res, JSON.stringify({error: 'Bad Request'}));
            }
        })
    }
    else
        Error400(res, JSON.stringify({error: 'Invalid method'}));
}