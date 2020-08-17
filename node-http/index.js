const http = require('http')

const hostname= 'localhost'

const port = 3000

const server =http.createServer((req,res) => {
    /* Know where the request is comming to this server */
    console.log(req.headers);
    /* Sending response to the request */
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html' );
    res.end('<html><body><h1>hello</h1></body></html>');
})

server.listen(port,hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`)
})