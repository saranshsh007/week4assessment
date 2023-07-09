const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  let contentType = getContentType(filePath) || 'text/html';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end('500 Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const getContentType = (filePath) => {
  let extname = path.extname(filePath);
  if (extname === '.js') {
    return 'text/javascript';
  } else if (extname === '.css') {
    return 'text/css';
  } else if (extname === '.json') {
    return 'application/json';
  } else if (extname === '.png') {
    return 'image/png';
  } else if (extname === '.jpg' || extname === '.jpeg') {
    return 'image/jpeg';
  } else if (extname === '.gif') {
    return 'image/gif';
  }
  return 'text/html';
};

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
