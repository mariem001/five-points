const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const app = express();

var main = require('./components/main');
var five = require('./components/five');

app.set('view engine', 'pug');

app.use(jsonParser);
app.use('/five', five);
app.use('/', main);


module.exports = app;