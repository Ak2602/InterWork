import createError from 'http-errors'; //used for generating errors
import express from 'express'; // used as a server
import path from 'path'; // used to work with internal directories and files
import cookieParser from 'cookie-parser'; //used to parse the cookie as the user requests
import logger from 'morgan'; // used as an middleware for logging process
import session, { Cookie } from 'express-session'; // used to keep track about users state
import bodyParser from 'body-parser'; // to collect the data from user
import flash from "express-flash"; //to show the popup message
import { fileURLToPath } from 'url';
import con from './database.js';
import { name } from 'ejs';


//import indexRouter from './routes/index';
// import usersRouter from './routes/users';

const app = express();
const port = process.env.port || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use(session({
  secret: "sukuna26",
  resave: false,
  saveUninitialized: true,
  Cookie: { maxAge: 60000 }
}));

app.use(flash());

app.get('/', (req, res) => {
  res.render('index', { title: 'WELCOME' });
});

app.get('/register', (req, res) => {
  res.render('register', { title: 'register' });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'login' });
});

app.post('/save', (function (req, res, next) {
  let user = req.body.username;
  let pass = req.body.password;

  let qry = (`INSERT INTO details (name, password) VALUES ("${user}", "${pass}")`);
  con.query(qry, function (err, result) {
    if (err) {
      console.log("User Not Registered");
    } else {
      console.log("record Updated");
      req.flash('success', 'User Added Successfully');
      res.redirect('/register');
    }
  });
}));

app.post('/auth', (function (req, res, next) {
  let us = req.body.client;
  let ps = req.body.secure;
  if (us && ps) {
    let compareQry = (`SELECT * FROM details WHERE name = "${us}" AND password = ${ps}`);
    con.query(compareQry, function (err, rows, fields) {
      if (err) throw err; 
      if(rows.length<= 0){
        console.log("false");
        res.redirect("/");
      }else {
        console.log("true");
        req.session.loggedin = true;
        req.session.name = name;
        req.flash('success', 'Login Successfull')
        res.redirect('/login');
        // console.log("record Updated");
        // req.flash('success', 'User Added Successfully');
        // res.redirect('/');
        
      }
    });
  }else{
    res.send("Enter Credentials !!!");
  }
}));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// listining to port
app.listen(port, () => {
  console.log(`Server is Running at ${port} `);
});
//export the app
export default app;

