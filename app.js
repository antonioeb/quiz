var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


// middleware de autologout de sesion
app.use(function(req, res, next) {
 //Comprobamos si el usuario ha iniciado sesion
 if(req.session.user){
 //Si no existe la variable que lleva el tiempo de sesion, la seteamos por primera vez
 if(!req.session.user.tiempoSesion){
 req.session.user.tiempoSesion=(new Date()).getTime();
 }else{
 //Si se ha sobrepasado los dos minutos sin actividad, cerramos sesion 
 if((new Date()).getTime()-req.session.user.tiempoSesion > 120000){
 delete req.session.user;
 //En caso contrario, no se ha superado la inactividad durante dos minutos y se resetea la marca del tiempo
 }else{
 req.session.user.tiempoSesion=(new Date()).getTime();
 }
 }
 }
 next();
});


// Helpers dinamicos:
app.use(function(req, res, next) {

 // guardar path en session.redir para despues de login
 if (!req.path.match(/\/login|\/logout/)) {
 req.session.redir = req.path;
 }

 // Hacer visible req.session en las vistas
 res.locals.session = req.session;
 next();
});


app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
	    errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
	errors: []
    });
});


module.exports = app;
