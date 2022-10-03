var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');//modulo que paso como middleware de aplicación.
//Cookie se guarda del lado del cliente. Session se guarda del lado del servidor.No sirve para guardar información sensible, para esto en session es mas seguro ya que se guarda del lado del servidor.
//en Session guardo información que está relativamente segura
var logger = require('morgan');

var app = express();//paso mas arriba 


//requerir Session. Inicializar. A usarse como middleware.

const session = require ('express-session')
//requerir middleware. Va después de la session ya que la session debe inicializar antes de este middleware.
const userLoggedMiddleware = require('./middlewares/userLoggedMiddleware')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));//middleware que recibe la información que viaja en un formulario via POST
app.use(cookieParser());//permite trabajar directamente en req y res con un objeto literal. Es un middleware
app.use(express.static(path.join(__dirname, 'public')));
//uso session como middleware de aplicación
//req.session puedo acceder a todo lo que tenga en el request
app.use(session({
	secret: "Shhh, It's a secret",
	resave: false,
	saveUninitialized: false,
}));
app.use(userLoggedMiddleware)

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
