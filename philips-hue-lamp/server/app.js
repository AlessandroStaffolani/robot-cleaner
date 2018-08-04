/**
 *Module dependencies
 */

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');


//==============================================================================

/**
 *Create app instance
 */

const app = express();

//==============================================================================

/**
 *Module Variables
 */

const port = process.env.PORT || 5000;
const env = config.env;
app.locals.errMsg = app.locals.errMsg || null;

//==============================================================================

/**
 *Module Settings and Config
 */

app.set('port', port);
app.set('env', env);

/**
 *DB Config
 */
mongoose.connect(config.dbURL);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('connected', function () {
    return console.log('Successfully connected to ' + config.dbURL);
});
db.once('disconnected', function () {
    return console.error('Successfully disconnected from ' + config.dbURL);
});

//==============================================================================

/**
 *App Middlewares
 */

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

//==============================================================================

/**
 *Routes
 */
const index = require('./routes/index');
const lamp = require('./routes/lamp');

app.use('/', index);
app.use('/lamp/', lamp);

//==============================================================================

/**
 *Error Handling
 */


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.command = err.command;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log(err);
    // render the error page
    res.status(err.status || 500);
    res.json({
        command: err.command,
        stack: err.stack
    });
});

//==============================================================================

/**
 *Export Module
 */

module.exports = app;

//==============================================================================
