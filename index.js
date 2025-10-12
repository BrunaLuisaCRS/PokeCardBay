const http = require('http');
const env = require('dotenv/config');

const PORT = process.env.PORT;
const HOST = process.env.HOST;

const server = http.createServer((request, response) =>{
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.end('Olá mundo!');
})

server.listen(PORT, HOST, ()=> {

    console.log('Servidor iniciado');
})