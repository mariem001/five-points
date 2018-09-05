const express = require('express');
const app = express();

var main = require('./components/main');
var five = require('./components/five');

app.use('/five', five);
app.use('/', main);


module.exports = app;