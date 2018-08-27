// Got started with: https://www.codementor.io/olatundegaruba/nodejs-restful-apis-in-10-minutes-q0sgsfhbd

process.env.NODE_ENV = 'development';

var express = require('express'),
  app = express(),
  port = process.env.PORT || 3030,
  dbName = 'NotesAtDB',
  mongoose = require('mongoose'),
  Notebook = require('./models/notebookModel'),
  Note = require('./models/noteModel');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);
mongoose.connect('mongodb://localhost:27017/' + dbName, {'useNewUrlParser': true});//
/*
 Middleware
*/
// Add headers for development
app.use(function (req, res, next) {
  // Enable CORS for all the :ports used in development
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.send(200);
  }
  else {
    next();
  }
});
app.use(express.urlencoded({extended: true}));
app.use(express.json());

var routes = require('./routes/appRoutes'); // importing route
routes(app);

// Catch 404 errors
app.use(function(req, res) {
  res.status(404).send(req.originalUrl + ' not found')
});

app.listen(port);

console.log('notes@ RESTful API server started on: ' + port);

// Catch attempts to stop process
process.on( 'SIGINT', function() {
  console.log( '\ngracefully shutting down from  SIGINT (Crtl-C)' );
  process.exit( )
});