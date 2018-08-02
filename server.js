const express = require('express');
const app = express();

const path = require('path');
const fs = require('fs');
const url = require('url');
const util = require('util')
var recursive = require('recursive-readdir');
var readline = require('readline');

app.set('port', 5000);

app.listen(app.get('port'), () => {
  console.log(`Example app listening on http://localhost:${app.get('port')}`);
});

app.get('/', (req, res) => {
  res.send(`<h1>My web app http API!</h1>`);
});

app.get('/routes/api/:apiVersion/*', (req, res) => {

  let apiVersion = req.params.apiVersion;

  let params = req.params;

  let filePath = req.path + '/' + req.method.toLowerCase() + '.json';

  let dirPath = path.join(__dirname, req.path).replace(`/${apiVersion}/`, '/');

  filePath = filePath.replace(`/${apiVersion}/`, '/');

  filePath = path.join(__dirname, filePath);

  res.setHeader('Content-type', 'application/json');

  fs.stat(dirPath, (err) => {

    if (err) {
      return res.send({ success: false });
    }

    recursive(`${dirPath}`, ['delete.json', 'put.json'], function (err, file) {

      const write = fs.createWriteStream(`${dirPath}/get.json`);

      const usersArr = [];

      let readStream;

      file.forEach(item => {
        readStream = fs.createReadStream(item);
        readStream.on('data', (data) => {
          JSON.parse(data).map(item => usersArr.push(item));
        });
      })

      readStream.on('end', (data) => {
        write.write(JSON.stringify(usersArr, null, ' '), () => {
          console.log('Completed');
        });

        fs.createReadStream(`${dirPath}/get.json`).pipe(res)
      });

    });

  });

  fs.unlink(`${dirPath}/get.json`, (err) => {

    if (err) console.log('error on delete stage');

    console.log('deleted complete');
  });

});
