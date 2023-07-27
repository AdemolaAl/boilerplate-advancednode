const passport = require('passport');
const bcrypt = require('bcryptjs');
const shortId = require('shortid')
const Memcached = require('memcached');
const memcached = new Memcached(); // Replace with your Memcached server configuration
/* code to connect with your memecahced server */
memcached.connect('localhost:3000', function (err, conn) {
  if (err) {
    console.log(conn.server, 'error while memcached connection!!');
  }
});
const { ObjectId } = require('mongodb');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const fs = require('fs');
const { error } = require('console');


module.exports = function (app, userDB, DB, productDB
) {
  // After connecting to MongoDB
  const bucket = new GridFSBucket(DB);

  


  app.route('/').get((req, res,) => {
    productDB.find({ tag: 'product' }).toArray((err, HomePageProducts) => {
      if (err) {
        next(err);
      } else {
        const HomePageProductsSliced = HomePageProducts.slice(0, 3);
        if (req.isAuthenticated()) {  
          let user = req.user
          res.render('index', { HomePageProductsSliced , flash: req.flash(), user});
          console.log(user)        
        }
        res.render('index', { HomePageProductsSliced,flash: req.flash()});
      }
    });

  });

  app.route('/drop').get((req, res,) => {

    bucket.drop(function (err, result) {
      if (err) {
        console.error('Error dropping GridFS bucket:', err);
        return;
      }

      console.log('GridFS bucket dropped successfully');
    });
  });

  app.route('/product/:cat').get((req, res) => {

    let { cat } = req.params

    productDB.find({ productType: cat }).toArray((err, use) => {
      if (err) {
        next(err);
      } else {
        res.render('product', { username: use });
      }
    });
  });


  const upload = multer({ dest: 'uploads/' });

  app.post('/add', upload.single('picture'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const picture = req.file;

    // Create a readable stream from the temporary file path
    const readableStream = fs.createReadStream(picture.path);

    // Configure the GridFS upload stream
    const uploadStream = bucket.openUploadStream(picture.originalname);

    // Pipe the readable stream to the GridFS upload stream
    readableStream.pipe(uploadStream)
      .on('error', (err) => {
        console.error('Error uploading file:', err);
        return res.sendStatus(500);
      })
      .on('finish', () => {
        console.log('File uploaded successfully');

        // Remove the temporary file
        fs.unlinkSync(picture.path);

        // Create a new document with the file ID
        const document = {
          name: req.body.name,
          fileId: uploadStream.id, // Store the GridFS file ID
          shortId: shortId.generate(),
          description: req.body.description,
          productType: req.body.type,
          price: req.body.price,
          arrival: 'new arrival',
          tag: 'product',
        };

        // Insert the document into the collection
        productDB.insertOne(document, (err, result) => {
          if (err) {
            console.error('Error inserting document:', err);
            return res.sendStatus(500);
          }
          res.redirect('/working');
        });
      });
  });


  app.route('/add').get((req, res) => {
    res.render('insert');
  });


  const { ObjectId } = require('mongodb');

  app.get('/deleteimage/:shortId', (req, res) => {
    const { shortId } = req.params;
    
    productDB.findOne({ shortId }, (err, productDocument) => {
      if (err) {
        console.error('Error retrieving image from productDB:', err);
        return res.sendStatus(500);
      }
      
      if (productDocument) {
        // The image is found in productDB, get the fileId from the document
        const fileId = new ObjectId(productDocument.fileId);
        
        // Delete the file from GridFS using the bucket
        bucket.delete(fileId, (err) => {
          if (err) {
            console.error('Error deleting image from GridFS:', err);
            return res.sendStatus(500);
          }
          
          console.log('Image deleted from productDB and GridFS');
          return res.sendStatus(200); // Sending a 200 status to indicate successful deletion
        });
      } else {
        userDB.findOne({ shortId }, (err, userDocument) => {
          if (err) {
            console.error('Error retrieving image from userDB:', err);
            return res.sendStatus(500);
          }
  
          if (!userDocument) {
            console.error('Image not found in both productDB and userDB');
            return res.sendStatus(404); // Sending a 404 status to indicate image not found
          }
  
          // The image is found in userDB, get the fileId from the document
          const fileId = new ObjectId(userDocument.fileId);
  
          // Delete the file from GridFS using the bucket
          bucket.delete(fileId, (err) => {
            if (err) {
              console.error('Error deleting image from GridFS:', err);
              return res.sendStatus(500);
            }
  
            console.log('Image deleted from userDB and GridFS');
            return res.sendStatus(200); // Sending a 200 status to indicate successful deletion
          });
        });
      }
    });
  });
  

  app.get('/images/:shortId', (req, res) => {
    const { shortId } = req.params;
  
    // Find the document by shortId in the productDB
    productDB.findOne({ shortId }, (err, productDocument) => {
      if (err) {
        console.error('Error retrieving image from productDB:', err);
        return res.sendStatus(500);
      }
  
      if (productDocument) {
        // The image is found in productDB, get the fileId from the document
        const fileId = new ObjectId(productDocument.fileId);
  
        // Open a download stream from GridFS in the productDB
        const downloadStream = bucket.openDownloadStream(fileId);
  
        // Set the appropriate content type
        res.contentType('image/png');
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.setHeader('Expires', new Date(Date.now() + 3600000).toUTCString());
  
        // Pipe the GridFS download stream to the response
        downloadStream.pipe(res)
          .on('error', (err) => {
            console.error('Error streaming image:', err);
            return res.sendStatus(500);
          });
      } else {
        // If the image is not found in productDB, try finding it in userDB
        userDB.findOne({ shortId }, (err, userDocument) => {
          if (err || !userDocument) {
            console.error('Error retrieving image from userDB:', err);
            return res.send('not found');
          }
  
          // The image is found in userDB, get the fileId from the document
          const fileId = new ObjectId(userDocument.fileId);
  
          // Open a download stream from GridFS in the userDB
          const downloadStream = bucket.openDownloadStream(fileId);
  
          // Set the appropriate content type
          res.contentType('image/png');
  
          // Pipe the GridFS download stream to the response
          downloadStream.pipe(res)
            .on('error', (err) => {
              console.error('Error streaming image:', err);
              return res.sendStatus(500);
            });
        });


      }
    });
  });
  

  app.get('/profile',ensureAuthenticated,(req, res)=>{
    res.render('profile', {user:req.user, flash: req.flash() })
  })

  app.post('/profileupdate', ensureAuthenticated, upload.single('picture'), (req, res) => {
    userDB.findOne({ shortId: req.user.shortId }, (err, userDocument) => {
      if (err) {
        console.error('Error retrieving image from userDB:', err);
        return res.sendStatus(500);
      }
  
      if (!userDocument) {
        console.error('Image not found in both productDB and userDB');
        return res.sendStatus(404); // Sending a 404 status to indicate image not found
      }
  
      // The image is found in userDB, get the fileId from the document
      const fileId = new ObjectId(userDocument.fileId);
  
      // Delete the file from GridFS using the bucket
      bucket.delete(fileId, (err) => {
        if (err) {
          console.error('Error deleting image from GridFS:', err);
          return res.sendStatus(500);
        }
  
        console.log('Image deleted from userDB and GridFS');
      });
    });

  
    const picture = req.file;
  
    // Create a readable stream from the temporary file path
    const readableStream = fs.createReadStream(picture.path);
  
    // Configure the GridFS upload stream
    const uploadStream = bucket.openUploadStream(picture.originalname);
  
    // Pipe the readable stream to the GridFS upload stream
    readableStream.pipe(uploadStream)
      .on('error', (err) => {
        console.error('Error uploading file:', err);
        return res.sendStatus(500);
      })
      .on('finish', () => {
        console.log('File uploaded successfully');
  
        // Remove the temporary file
        fs.unlinkSync(picture.path);
  
        // Insert the document into the collection
        userDB.updateOne(
          { username: req.user.username },
          { $set: { username: req.body.username, email: req.body.email, fileId: uploadStream.id, firstname:req.body.firstname, lastname:req.body.lastname } },
          (err, result) => {
            if (err) {
              console.log('Error updating profile:', err);
              // Set an error flash message
              req.flash('error', 'Error updating profile. Please try again.');
              return res.redirect('/profile'); // Redirect to profile page on error
            } else {
              console.log('Profile updated successfully');
              // Set a success flash message
               // Redirect to profile page on success
            }
          }
        );
      });
      req.flash('success', 'Profile updated successfully!');
      return res.redirect('/profile');
  });

  app.post('/passwordupdate', ensureAuthenticated, (req, res) => {
    const hash = bcrypt.hashSync(req.body.newpassword, 12);
  
    if (!bcrypt.compareSync(req.body.currentpassword, req.user.password)) {
      req.flash('error', 'Incorrect Password');
      return res.redirect('/profile');
    } else {
      userDB.updateOne(
        { username: req.user.username },
        { $set: { password: hash } },
        (err, result) => {
          if (err) {
            console.log('Error updating password:', err);
            req.flash('error', 'Error updating password. Please try again.');
            return res.redirect('/profile');
          } else {
            console.log('Password updated successfully');
            req.flash('success', 'Password updated successfully.');
            return res.redirect('/profile');
          }
        }
      );
    }
  });
  
  
  


  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  app.route('/productpage/:shortId').get((req, res, next) => {
    const { shortId } = req.params;

    const cacheKey = `productCache_${shortId}`;

    // Try to get the value from the cache
    memcached.get(cacheKey, (err, cachedData) => {
      if (!err && cachedData) {
        // Value found in cache, use it
        const { work, singleProduct } = cachedData;
        return res.render('productpage', { item: work, username: shuffleArray(singleProduct) });
      }

      // Value not found in cache, fetch it from the database
      productDB.findOne({ shortId }, (err, work) => {
        if (err) {
          return next(err);
        }

        productDB.find({ tag: 'product' }).toArray((err, singleProduct) => {
          if (err) {
            return next(err);
          }

          // Cache the query result
          const dataToCache = { work, singleProduct };
          memcached.set(cacheKey, dataToCache, 3600, (err) => {
            if (err) {
              console.error('Error caching data:', err);
            }
          });

          // Set the caching headers
          res.setHeader('Cache-Control', 'public, max-age=3600');
          res.setHeader('Expires', new Date(Date.now() + 3600000).toUTCString());

          res.render('productpage', { item: work, username: shuffleArray(singleProduct) });
        });
      });
    });
  });

  app.get('/name/:shortId', (req, res) => {
    const { shortId } = req.params;
    productDB.findOne({ shortId }, (err, name) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('Expires', new Date(Date.now() + 3600000).toUTCString());

      res.send(name.name)
    })
  })

  app.get('/price/:shortId', (req, res) => {
    const { shortId } = req.params;
    productDB.findOne({ shortId }, (err, name) => {
      if (err) {
        return next(err);
      }
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('Expires', new Date(Date.now() + 3600000).toUTCString());

      res.send(name.price)
    })
  })

  app.get('/shoppingcart', ensureAuthenticated, (req, res) => {

    productDB.find({ tag: 'product' }).toArray((err, singleProduct2) => {
      if (err) {
        res.render('index', { err });
        return next(err);

      }

      // Set the caching headers
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('Expires', new Date(Date.now() + 3600000).toUTCString());

      res.render('shoppingcart', { user: req.user, products: shuffleArray(singleProduct2) });
    });
  })

  app.route('/addtocart/:shortId').post(ensureAuthenticated, (req, res) => {


    const { shortId } = req.params;

    productDB.findOne({ shortId }, (err, work) => {
      if (err) {
        next(err);
      } else {

        userDB.updateOne(
          { username: req.user.username },
          { $push: { cart: { shortId, color: req.body.color, size: req.body.size } } },
          (err, result) => {
            // handle the result
            if (err) {
              console.log('error');
            } else {
              res.redirect('/shoppingcart');
            }
          }
        );
      }
    })
  });




  app.route('/signin').get((req, res) => {
    if (req.isAuthenticated()) {
      res.redirect('/profile');
    } else {
      res.render('signin', {flash: req.flash()});
    }
  });

  app.route('/register').get((req, res) => {
    res.render('register', {flash: req.flash()});
  });



  app.get('/register-step1', (req, res) => {
    res.render('register-step1', { flash: req.flash() });
  });
  
  app.post('/register1', (req, res) => {
    userDB.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        req.flash('error', 'You need to log in to access this page.');
        res.redirect('/');
      } else if (user) {
        req.flash('error', 'Email already exists');
        res.redirect('/register-step1');
      } else {
        req.session.registrationData = {
          email: req.body.email
        };
        res.redirect('/register-step2');
      }
    });
  });
  
  app.get('/register-step2', (req, res) => {
    const registrationData = req.session.registrationData;
    if (!registrationData) {
      return res.redirect('/register-step1');
    }
    res.render('register-step2', { data: registrationData, flash: req.flash() });
  });
  
  app.post('/register2', (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, 12);
    req.session.registrationData.password = hash;
    res.redirect('/register-step3');
  });
  
  app.get('/register-step3', (req, res) => {
    const registrationData = req.session.registrationData;
    if (!registrationData) {
      return res.redirect('/register-step1');
    }
    res.render('register-step3', { data: registrationData });
  });
  
  app.post('/register3', (req, res) => {
    userDB.insertOne(
      {
        username: req.body.username,
        email: req.session.registrationData.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.session.registrationData.password,
        cart: [],
        fileId: '',
        shortId: shortId.generate()
      },
      (err, result) => {
        if (err) {
          console.log('Error inserting user:', err);
          req.flash('error', 'Error registering user. Please try again.');
        } else {
          console.log('User registered successfully');
          req.flash('success', 'Registration successful.');
        }
        res.redirect('/register-step1');
      }
    );
    delete req.session.registrationData;
  });
  




  app.route('/login').post((req, res, next) => {
    passport.authenticate('local', {
      failureRedirect: '/signin',
      failureFlash: true // Enable flash messages for authentication failures
    })(req, res, next);
  }, (req, res) => {
    // This is the success callback after successful authentication
    req.flash('success', 'Successfully Signed in');
    res.redirect('/');
  });

  app.get('/logout', function (req, res, next) {
    req.logout(function (err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

  app.post('/register', upload.single('picture'), (req, res, next) => {
    const hash = bcrypt.hashSync(req.body.password, 12);
    const picture = req.file;

    userDB.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        req.flash('error', 'You need to log in to access this page.');
        res.redirect('/')
        next(err);
      } else if (user) {
        req.flash('error', 'Email already exists');
        res.redirect('/register')
      } else {

    // Create a readable stream from the temporary file path
    const readableStream = fs.createReadStream(picture.path);

    // Configure the GridFS upload stream
    const uploadStream = bucket.openUploadStream(picture.originalname);

    // Pipe the readable stream to the GridFS upload stream
    readableStream.pipe(uploadStream)
      .on('error', (err) => {
        console.error('Error uploading file:', err);
        return res.sendStatus(500);
      })
      .on('finish', () => {
        console.log('File uploaded successfully');

        // Remove the temporary file
        fs.unlinkSync(picture.path);

        // Create a new document with the file ID
        
            userDB.insertOne({
              username: req.body.username,
              email: req.body.email,
              firstname: req.body.FirstName,
              lastname:req.body.LastName,
              password: hash,
              cart: [],
              shortId: shortId.generate(),
              fileId: uploadStream.id,
            },
              (err, doc) => {
                if (err) {
                  res.redirect('/');
                } else {
                  // The inserted document is held within
                  res.redirect('/profile')
                  console.log(doc)
                  // the ops property of the doc
                  next(null, doc.ops[0]);
                }
              }
            )
          
      });
    }
  });
  },
  passport.authenticate('local', { failureRedirect: '/' }),
  (req, res, next) => {
    res.redirect('/profile');
  }
);

  app.route('/regist').post((req, res, next) => {
    const hash = bcrypt.hashSync(req.body.password, 12);

    userDB.findOne({ username: req.body.username }, (err, user) => {
      if (err) {
        next(err);
      } else if (user) {
        res.redirect('/');
      } else {
        userDB.insertOne({
          username: req.body.username,
          email: req.body.email,
          password: hash,
          cart: []
        },
          (err, doc) => {
            if (err) {
              res.redirect('/');
            } else {
              // The inserted document is held within
              res.redirect('/profile')
              console.log(doc)
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

  else {
    // User is not authenticated, redirect to the login page or handle the error as required
    req.flash('error', 'You need to log in to access this page.');
    res.redirect('/');
  }
};