let writeHTTP405 = (res)=>{
    res.statusCode = 405;
    res.statusMessage = "Method not allowed";
    res.end('Method not allowed');
};

