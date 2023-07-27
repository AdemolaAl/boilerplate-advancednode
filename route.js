const passport = require('passport');
const bcrypt = require('bcryptjs');
const session = require('express-session');



module.exports = function(app, Cluster) {
  app.route('/').get((req, res) => {
     if (req.isAuthenticated()) {
     res.redirect('/profile');
  } else{
    res.render('index');}
  });
  app.route('/signin').get((req, res) => {
    if (req.isAuthenticated()) {
     res.redirect('/profile');
  } else{
    res.render('sign');}
  });

  app.route('/register').get((req, res) => {
    res.render('register');
  });

  app.route('/login').post(passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/profile');
  });

  app.route('/profile').get(ensureAuthenticated, (req, res) => {
    res.render('prof', { username: req.user.username, email:req.user.email });
  });
  app.route('/chat').get(ensureAuthenticated, (req, res) => {
    res.render('chat', { user: req.user });
  });





  app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });
 


  app.route('/register').post((req, res, next) => {
    const hash = bcrypt.hashSync(req.body.password, 12);
    Cluster.findOne({ username: req.body.username }, (err, user) => {
      if (err) {
        next(err);
      } else if (user) {
        res.redirect('/');
      } else {
        Cluster.insertOne({
          username: req.body.username,
          email:req.body.email,
          password: hash
        },
          (err, doc) => {
            if (err) {
              res.redirect('/');
            } else {
              // The inserted document is held within
              res.redirect('/profile')
              // the ops property of the doc
              next(null, doc.ops[0]);
            }
          }
        )
      }
    })
  },
    passport.authenticate('local', { failureRedirect: '/' }),
    (req, res, next) => {
      res.redirect('/profile');
    }
  );

  app.get('/auth/github', passport.authenticate('github'), (req, res) => { })


  app.route('/auth/github/callback').get(passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {

    res.redirect("/profile");
  })

  app.get('/auth/google',
    passport.authenticate('google', {
      scope:
        ['email', 'profile']
    }
    ));

  app.get('/auth/google/callback',
    passport.authenticate('google', {

      successRedirect: '/profile',
      failureRedirect: '/'
    }));

  app.use((req, res, next) => {
    res.status(404)
      .type('text')
      .send('Not Found');
  });
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};