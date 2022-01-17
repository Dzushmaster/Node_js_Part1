//sum(square(3),square(5,4),mul(3,5,7,9,11,13)) + fib(7) * mul(2,4,6)
const async = require('async');
const rpcWSC = WebSocket = require('rpc-websockets').Client;
let ws = new rpcWSC('ws://localhost:4000');
let result = 0;
ws.on('open', ()=>{
    ws.login({login: 'vvv', password: '777'}).then(async(login)=>{await calc()});
});
async function calc(){
    console.log('result = '+  (await ws.call('sum', [
        await ws.call('square', [3]),
        await ws.call('square', [5, 4]),
        await ws.call('mul', [3, 5 ,7 ,9 , 11, 13])        
    ]) + await ws.call('fib', [7]) * await ws.call('mul', [2, 4 ,6])
    ));
}
// let h = ()=>async.waterfall([
//     (cb)=>{ ws.call('mul', [2, 4, 6]).catch((e)=>(e, null)).then((r)=>{cb(null, r); result = r;});},
//     (p, cb)=>{
//          ws.login({login:'vvv', password:'777'}).then((login)=>{
//             if(login)
//                 ws.call('fib', [7]).catch((e)=>cb(e, null)).then((r)=>cb(null, r));
//             else cb({message1:'login error'}, null);
//          })
//         },
//     (p, cb)=>{ ws.call('mul', [p, result]).catch((e)=>cb(e, null)).then((r)=>{cb(null, r); result = r;});},
//     (p, cb)=>{ ws.call('mul', [3,5,7,9,11,13]).catch((e)=>cb(e, null)).then((r)=>cb(null, r)); },
//     (p, cb)=>{ ws.call('sum', [p, result]).catch((e)=>cb(e, null)).then((r)=>{cb(null, r); result = r;})},
//     (p, cb)=>{ ws.call('square', [5, 4]).catch((e)=>cb(e, null)).then((r)=>cb(null, r)); },
//     (p, cb)=>{ ws.call('sum', [p, result]).catch((e)=>cb(e, null)).then((r)=>{cb(null, r); result = r;}); },
//     (p, cb)=>{ ws.call('square', [3]).catch((e)=>cb(e, null)).then((r)=>cb(null, r)) ; },
//     (p, cb)=>{ ws.call('sum', [p, result]).catch((e)=>cb(e, null)).then((r)=>cb(null, r)); },
// ],
// (e, r)=>{
//     if(e) console.log('e = ', e);
//     else console.log('r = ', r);
//     ws.close();
// });
//ws.on('open', h);