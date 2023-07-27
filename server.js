'use strict';
const dotenv = require("dotenv");
dotenv.config({ path: "sample.env" });
const express = require('express');
const myDB = require('./connection');
const session = require('express-session');
const passport = require('passport');
const routes = require('./route.js');
const auth = require('./auth.js');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/Pictures', express.static(process.cwd() + '/Pictures'));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(passport.initialize());

app.use(passport.session())

app.set('view engine', 'pug')

app.set('views', './views/pug')


myDB(async client => {
  const Cluster = await client.db('cluster0').collection('users');
  routes(app, Cluster);
  auth(app, Cluster);

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
