// Importiert das eingebaute http-Modul
const http = require('http');

// Erstelle einen neuen Webserver:
const server = http.createServer((req, res) => {
    // Antwort setzen, wenn der Webserver aufgerufen wird:
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    // Der Text, der in die Antwort eingefügt wird
    res.end('testest\n');
    res.end('Hello World\n');
});

// Der Server ist erreichbar unter Port 3000, der Link wird in der Console ausgegeben.
server.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});