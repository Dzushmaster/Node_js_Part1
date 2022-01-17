const http = require("http");
const st = require("./m07-01")("./static");
const GET_Handler = (req, res) =>{
    if(st.isStatic('html', req.url))
        st.sendFile(req, res, {"Content-Type": "text/html; charset=utf-8"});
    else if(st.isStatic('css', req.url))
        st.sendFile(req, res, {"Content-Type": "text/css; charset=utf-8"});
    else if(st.isStatic('js', req.url))
        st.sendFile(req, res, {"Content-Type": "text/javascript; charset=utf-8"});
    else if(st.isStatic('png', req.url))
        st.sendFile(req, res, {"Content-Type": "image/png; charset=utf-8"});
    else if(st.isStatic('docx', req.url))
        st.sendFile(req, res, {"Content-Type": "application/msword; charset=utf-8"});
    else if(st.isStatic('json', req.url))
        st.sendFile(req, res, {"Content-Type": "application/json; charset=utf-8"});
    else if(st.isStatic('xml', req.url))
        st.sendFile(req, res, {"Content-Type": "application/xml; charset=utf-8"});
    else if(st.isStatic('mp4', req.url))
        st.sendFile(req, res, {"Content-Type": "video/mp4; charset=utf-8"});
    else st.writeHTTP404(res);
};
const httpHandler = (req, res)=>{
    if(req.method == 'GET')
        GET_Handler(req, res);
    else
        st.writeHTTP405(res);
}
const server = http.createServer();
server.listen(5000, ()=>{console.log("server.listen(5000)");})
.on('error', (err)=>{console.log(`Error: ${err.code}`);})
.on('request', httpHandler);