var i18next = require('i18next');
var FsBackend = require('i18next-node-fs-backend');
var middleware = require('i18next-express-middleware');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/editor', function(req, res) {
  res.sendFile(__dirname + '/debugEditor.html');
});

app.get('/locizify.js', function(req, res) {
  fs.readFile(__dirname + '/../../locizify/locizify.js', 'utf-8', function(err, doc) {
    res.send(doc);
  });
});

app.get('/locize-editor.js', function(req, res) {
  fs.readFile(__dirname + '/../locize-editor.js', 'utf-8', function(err, doc) {
    res.send(doc);
  });
});

// in your request handler
// app.get('myRoute', function(req, res) {
//   var lng = req.language; // 'de-CH'
//   var lngs = req.languages; // ['de-CH', 'de', 'en']
//   req.i18n.changeLanguage('en'); // will not load that!!! assert it was preloaded
//
//   var exists = req.i18n.exists('myKey');
//   var translation = req.t('myKey');
// });

app.listen(8080);
