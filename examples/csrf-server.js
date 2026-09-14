const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8080;
const pagePath = path.join(__dirname, 'csrf-malicioso.html');

const server = http.createServer((request, response) => {
    if (request.url !== '/' && request.url !== '/csrf-malicioso.html') {
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Página não encontrada.');
        return;
    }

    fs.readFile(pagePath, (error, content) => {
        if (error) {
            response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            response.end('Erro ao carregar a página.');
            return;
        }

        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(content);
    });
});

server.listen(port, () => {
    console.log(`Página de teste disponível em http://localhost:${port}/csrf-malicioso.html`);
});
