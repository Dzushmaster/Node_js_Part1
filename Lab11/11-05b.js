const async = require('async');
const rpcWSC = WebSocket = require('rpc-websockets').Client;
let ws = new rpcWSC('ws://localhost:4000');
let h = ()=>async.parallel({
    square: (cb)=>{ws.call('square', [3]).catch((e)=>cb(e,null)).then((r)=>cb(null, r));},
    square1: (cb)=>{ws.call('square', [5, 3]).catch((e)=>cb(e,null)).then((r)=>cb(null, r));},
    sum: (cb)=>{ws.call('sum', [2]).catch((e)=>cb(e,null)).then((r)=>cb(null, r));},
    sum2: (cb)=>{ws.call('sum', [2, 4, 6, 8, 10]).catch((e)=>cb(e,null)).then((r)=>cb(null, r));},
    mul: (cb)=>{ws.call('mul', [3]).catch((e)=>cb(e,null)).then((r)=>cb(null, r));},
    mul2: (cb)=>{ws.call('mul', [3, 5, 7, 9, 11, 13]).catch((e)=>cb(e,null)).then((r)=>cb(null, r));},
    fib: (cb)=>{
        ws.login({login: 'vvv', password:'777'}).then((login)=>{
            if(login) ws.call('fib', [1]).catch((e)=>cb(e, null)).then((r)=>cb(null,r));
        })
    },
    fib2: (cb)=>{
        ws.login({login: 'vvv', password:'777'}).then((login)=>{
            if(login) ws.call('fib', [2]).catch((e)=>cb(e, null)).then((r)=>cb(null,r));
        })
    },
    fib3: (cb)=>{
        ws.login({login: 'vvv', password:'777'}).then((login)=>{
            if(login) ws.call('fib', [2]).catch((e)=>cb(e, null)).then((r)=>cb(null,r));
        })
    },
    fib4: (cb)=>{
        ws.login({login: 'vvv', password:'777'}).then((login)=>{
            if(login) ws.call('fib', [7]).catch((e)=>cb(e, null)).then((r)=>cb(null,r));
        })
    },
    fib5: (cb)=>{
        ws.login({login: 'vvv', password:'777'}).then((login)=>{
            if(login) ws.call('fact', [0]).catch((e)=>cb(e, null)).then((r)=>cb(null,r));
        })
    },
    fib6: (cb)=>{
        ws.login({login: 'vvv', password:'777'}).then((login)=>{
            if(login) ws.call('fact', [5]).catch((e)=>cb(e, null)).then((r)=>cb(null,r));
        })
    },
    fib7: (cb)=>{
        ws.login({login: 'vvv', password:'777'}).then((login)=>{
            if(login) ws.call('fact', [10]).catch((e)=>cb(e, null)).then((r)=>cb(null,r));
        })
    }
},
(e,r)=>{
    if(e) console.log('e = ', e);
    else console.log('r = ', r);
    ws.close();
});
ws.on('open', h);