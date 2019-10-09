const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const chalk = require('chalk');

const router = express.Router();

// Import the User Model
require('../models/User');
const User = mongoose.model('user');

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (password !== password2) {
    errors.push({ text: 'Password do not match' });
  }

  if (password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters' });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name,
      email,
      password
    });
  } else {
    // console.log(req.body);
    User.findOne({ email: email }).then(user => {
      if (user) {
        req.flash('error_msg', 'Email already exists');
        res.redirect('/users/register');
      } else {
        const newUser = {
          name,
          email,
          password
        };

        // Bcrypt
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;

            new User(newUser)
              .save()
              .then(user => {
                req.flash('success_msg', 'New user registered!');
                res.render('users/login');
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

module.exports = router;
