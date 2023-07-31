'use strict';
const dotenv = require("dotenv");
dotenv.config({ path: "sample.env" });
let bodyParser= require('body-parser')
const express = require('express');
const myDB = require('./connection');
const session = require('express-session');
const flash = require('express-flash');
const multer = require('multer');
const passport = require('passport');
const routes = require('./route.js');
const auth = require('./auth.js');
const { dirname } = require("path");
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
app.use('/public', express.static(__dirname + '/public'));
app.use('/pictures', express.static(process.cwd() + '/pictures'));
const upload = multer({ dest: 'uploads/' });


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Connection', 'keep-alive');
  next();
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(flash());
app.use(passport.initialize());

app.use(passport.session())

app.set('view engine', 'pug')

app.set('views', './views/pug')





myDB(async client => {
  const userDB = await client.db('cluster0').collection('users');
  const productDB = await client.db('cluster0').collection('products')
  const DB = await client.db('cluster0');
  routes(app, userDB, DB, productDB);
  auth(app, userDB, productDB);

  io.on('connection', socket => {
    console.log('A user has connected');
  });

}).catch(e => {
  app.route('/').get((req, res) => {
    res.render('index', { title: e, message: 'Unable to connect to database' });
  });
});


const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
