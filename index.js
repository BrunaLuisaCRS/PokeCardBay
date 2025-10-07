const http = require('http');

const server = http.createServer((request, response) => {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.end("Olá pikomon!");
})

server.listen(300, '0.0.0.0', () => {console.log("Servidor iniciado");})