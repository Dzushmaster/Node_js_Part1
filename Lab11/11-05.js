const rpcWSS = require('rpc-websockets').Server;
let server = new rpcWSS({port:4000, host:'localhost'});
server.setAuth((l) => l.login === 'vvv' && l.password === '777');
server.register('sum', (params)=>{
    let sum = 0;
    params.forEach(elem=>{
        if(!isNaN(elem)) sum+=elem;
    });
    return sum;
}).public();
server.register('mul', (params)=>{ 
    let mul = 1;
    params.forEach(elem => {
        if(!isNaN(elem)) mul*=elem;
    })
    return mul;
}).public();
server.register('square', (params)=>{ return params.length === 2 ? params[0] * params[1] : Math.PI * (params[0] ** 2);}).public();
server.register('fib', (n) =>{ return Math.round(((1 + 5 ** 0.5) / 2) ** n / 5 ** 0.5)}).protected();
server.register('fact', (n) =>{ 
    return factorial(n);
}).protected();
function factorial(n) {
    if(n == 0)
        return 1;
    return (n != 1) ? n * factorial(n - 1) : 1;
}