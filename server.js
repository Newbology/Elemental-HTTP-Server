'use strict';
const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const PORT = process.env.PORT || 8080;

const server = http.createServer(function(req, res) {
  let theRequestMethod = req.method;

  let setURI = req.url;
  if (req.url === '/') {
    setURI = '/index.html';
  }
  // if (req.url === '/') {
  //   fs.readFile('./public/index.html', 'utf8', (err, data) => {
  //     if (err) {
  //       throw err;
  //     }
  //     res.write(data);
  //     res.end();
  //   });
  // }

  if (theRequestMethod === 'POST') {
    let body = '';

    req.on('data', function(chunk) {
      let body = querystring.parse(chunk.toString());

      let newFileTemplate = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>The Elements - ${body.elementName} </title>
          <link rel="stylesheet" href="/css/styles.css" />
        </head>
        <body>
          <h1>${body.elementName}</h1>
          <h2>${body.elementSymbol}</h2>
          <h3>Atomicnumber ${body.elementAtomicNumber}</h3>
          <p>
          ${body.elementDescription}
          </p>
          <p><a href="/">back</a></p>
        </body>
      </html>`;

      let newFile = `./public/${body.elementName}.html`;

      fs.appendFile(newFile, newFileTemplate, 'utf8', err => {
        if (err) {
          throw err;
        }
      });
      res.write('New file created');
      res.end();
    });
  }

  if (theRequestMethod === 'GET') {
    fs.readFile('./public' + setURI, 'utf8', (err, data) => {
      if (err) {
        fs.readFile('./public/error.html', (err, data) => {
          res.write(data);
          res.end();
        });
      } else {
        res.write(data);
        res.end();
      }
    });
  }

  console.log('req.url', req.url);
  if (theRequestMethod === 'PUT') {
    fs.readdir('./public', 'utf8', (err, files) => {
      if (err) {
        throw err;
      } else {
        if (!files.includes(setURI.slice(1))) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(`{ "error" : "resource ${req.url} does not exist" }`);
        } else {
          let body = '';

          req.on('data', function(chunk) {
            let body = querystring.parse(chunk.toString());

            let fileTemplate = `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <title>The Elements - ${body.elementName} </title>
              <link rel="stylesheet" href="/css/styles.css" />
            </head>
            <body>
              <h1>${body.elementName}</h1>
              <h2>${body.elementSymbol}</h2>
              <h3>Atomicnumber ${body.elementAtomicNumber}</h3>
              <p>
              ${body.elementDescription}
              </p>
              <p><a href="/">back</a></p>
            </body>
          </html>`;
            let theFile = `./public/${req.url}`;
            fs.writeFile(theFile, fileTemplate, err => {
              if (err) {
                throw err;
              } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(`{ "success" : true}`);
              }
            });
          });
        }
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
