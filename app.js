
const express = require('express');
const app = express();

app.get('/',(req, res, next) => {
    res.status(200).json({
        message:"Hello World!"
    });
});


app.route('/book')
  .get(function(req, res) {
    res.send('Get a random book');
  })
  .post(function(req, res) {
    res.send('Add a book');
  })
  .put(function(req, res) {
    res.send('Update the book');
  });

  
module.exports = app;