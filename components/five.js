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

// Error handling
const sendError = (err, res, code) => {
  response.status = code;
  response.message = typeof err == 'object' ? err.message : err;
  res.status(code).json(response);
};

// Response handling
let response = {
  status: 200,
  data: [],
  message: null
};

// Get element by _id
let getCourseByID = (id, res, cb) => {
  let oid = {_id:ObjectID(id)};
  connection(db=>{
    db.collection('courses').findOne(oid).then(result=>{
      response.data = result;
      response.message= "OK";
      cb(result);
      if(res){
        res.json(response);
      }
    }).catch(err=>{
      if(res){
        sendError(err,res,501);
      }
    });
  });  
};

// define the home page route
router.get('/', function(req, res, next) {
  connection(db=>{
    db.collection('courses').find().toArray((err,result)=>{
        response.data = result;
        response.message= 'Five points home page';
        res.json(response);
    })
  });
});

// Show pretty course
router.get('/course/:id/pretty', function(req, res, next) {
  let course  = getCourseByID(req.params.id, false, course =>{
    res.type("text/html");
    res.send("<h2>"+course.title+"</h2><p>"+course.name+"<p>");
  });
});

router.get('/course/:id', function(req, res, next) {
  getCourseByID(req.params.id, res);
});
 
router.patch('/update/:id', function(req, res, next) {
  let id = req.params.id;
  let args = {_id:ObjectID(id)};
  connection(db=>{
    db.collection('courses').updateOne(args,{$set:{name:"new field updated"}},{ upsert: false });
    res.send('Update five points training ID: '+args._id);
  });
});

// Add new course
router.post('/new', function(req, res, next) {
  let course = {req.body};
  course._id = ObjectID();
  console.log(course);
  connection(db=>{
    db.collection('courses').insertOne(course).then(result=>{
      response.data = result;
      response.message= "OK";
      if(res){
        res.json(response);
      }
    }).catch(err=>{
      if(res){
        sendError(err,res,501);
      }
    });
  });
});


// Delete unwanted course
router.delete('/delete/:id', function(req, res, next) {
  connection(db=>{
    db.collection('courses').deleteOne({_id:ObjectID(req.params.id)}).then(result=>{
      response.data = result;
      response.message= "OK";
      if(res){
        res.json(response);
      }
    }).catch(err=>{
      if(res){
        sendError(err,res,501);
      }
    });
  });
});

// define the about route
router.get('/about', function(req, res, next) {
  res.send('About five points');
});

module.exports = router;
