const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;


let course1 = {'name':'course1'};
let course2 = {'name':'course2'};
let lotsOfCourses = [{'name':'course3'}, {'name':'course4'}];

// Connect to the db
const connection = (closure) => {
  return MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err) return console.log(err);    
    console.log("We are connected");
    let db = client.db('training');
    closure(db);
  })
};


// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res, next) {
  connection(db=>{
    db.collection('courses').find().toArray((err,result)=>{
        let response = {};
        response.data = result;
        response.message= 'Five points home page';
        res.json(response);
    })
  });

});

router.put('/update/:id', function(req, res, next) {
  let args = {_id:ObjectID(req.params.id)};
  
  connection(db=>{
    db.courses.update(args,{"newfield":"test"},{ upsert: false });
    res.send('Update five points training ID: '+args._id);
  });
});

router.post('/new', function(req, res, next) {
  res.send('New five points training');
});

// define the about route
router.get('/about', function(req, res, next) {
  res.send('About five points');
});

module.exports = router;
