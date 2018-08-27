/**
 * If your development machine is configured for SSL this version of server.js
 * will allow you to run services over https://. You will need to move copies
 * of your private key and certificate somewhere this file can gain access to
 * them. I chose to create a /keys/ directory inside of ./api/. Adjust path
 * and file name as you see fit below for the privateKey & certificate variables.
*/

process.env.NODE_ENV = 'production';

var express = require('express'),
  fs = require('fs'),
  http = require('http'),
  https = require('https'),
  app = express(),
  port = process.env.PORT || 3030,
  sslPort = 3031,
  privateKey = fs.readFileSync('key/YOUR_PRIVATE_KEY.key'),
  certificate = fs.readFileSync('key/YOUR_CERTIFICATE.crt'),
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

//app.listen(port);
http.createServer(app).listen(port);
https.createServer({
  key: privateKey,
  cert: certificate
}, app).listen(sslPort);

console.log('notes@ RESTful API server started on: http [' + port + '] https [' + sslPort + ']');

// Catch attempts to stop process
process.on( 'SIGINT', function() {
  console.log( '\ngracefully shutting down from  SIGINT (Crtl-C)' );
  process.exit( )
});