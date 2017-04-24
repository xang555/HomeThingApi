"use strict";

var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var index = require('./routes/index');
var conf = require('./config')();
var helmet = require('helmet');

var app = express();

app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.Promise = global.Promise;

var connectionUri = conf.database.dev.url;

if (process.env.NODE_ENV === 'production'){
 connectionUri = "mongodb://"+conf.database.product.user+":"+conf.database.product.passwd+"@";
 connectionUri+=conf.database.product.url+":"+conf.database.product.port+"/"+conf.database.product.dbname;
}

mongoose.connect(connectionUri).then(function () {
    console.log('connected database!...');
}).catch(function (err) {
   console.error(err);
});


app.use('/homething', index);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({err : 401 , msg : 'invalid token...'});
    }
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);

});

module.exports = app;
