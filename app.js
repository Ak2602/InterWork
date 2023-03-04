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

app.get('/admin', (req, res) => {
  res.render('admin', { title: 'admin' });
});

app.post('/save', (function (req, res, next) {
  let user = req.body.username;
  let pass = req.body.password;
  let searchQry = (`SELECT * FROM details WHERE name = "${user}"`);
  let qry = (`INSERT INTO details (name, password) VALUES ("${user}", "${pass}")`);
  con.query(searchQry, function (err, result) {
    if (err) {
      req.flash('warn', 'Failed to register!!');
      res.redirect('/register');
    }
    if (result.length !== 0) {
      req.flash('warn', 'user already exists!!');
      res.redirect('/register');

    } else {
      con.query(qry, function (err, results) {
        if (err) throw err;
        console.log("Registered Successfully!!");
        req.flash('success', 'User Added Successfully');
        res.redirect('/register');
      });
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
      if (rows.length <= 0) {
        req.flash('warn', 'Invalid Credentials!!!')
        res.redirect("/login");
      } else {
        console.log("true");
        req.session.loggedin = true;
        req.session.name = name;
        req.flash('success', 'Login Successfull');
        res.redirect('/admin');
      }
    });
  } else {
    req.flash('warn', 'Enter Details');
  }
}));

app.post('/update', function (req, res) {
  let n_ame = req.body.n_ame;
  let p_ass = req.body.p_ass;
  let sQry = (`SELECT * FROM details WHERE name = "${n_ame}"`);
  let updateQuery = (`UPDATE details SET password = ${p_ass} WHERE name = "${n_ame}" `);
  con.query(sQry, function (err, result) {
    if (err) {
      req.flash('warn', 'Failed to update!!');
      res.redirect('/admin');
    }
    if (result.length == 0) {
      req.flash('warn', 'record does not exists!!');
      res.redirect('/admin');
    }else{
      con.query(updateQuery, function(err, results){
        if (err) throw err;
        console.log("true");
        req.flash('success', 'Record updated Successfully');
        res.redirect('/admin'); 
      });
    }
  });
});

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

