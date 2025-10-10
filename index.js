const http = require('http');

const server = http.createServer((request, response) => {
    console.log(request.url);
    console.log(request,method);
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.end("Olá pikomon!");
})

server.listen(300, '0.0.0.0', () => {console.log("Servidor iniciado");})


