const express = require('express');
const mongoose = require('mongoose');
const chalk = require('chalk');

const { ensureAuthenticated } = require('../helpers/auth');

const router = express.Router();

// Import the Model Idea
require('../models/Idea');
const Idea = mongoose.model('idea');

router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({ user: req.user.id })
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('notes/index', {
        ideas
      });
    });
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    if (idea.user !== req.user.id) {
      req.flash('error_msg', 'Dude! Is not your note! You are not authorized');
      res.redirect('notes');
    } else {
      res.render('notes/edit', {
        idea
      });
    }
  });
});

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('notes/add');
});

router.post('/', (req, res) => {
  const { title, description } = req.body;
  const errors = [];

  if (!req.body.title) {
    errors.push({ text: 'Dude! Add some title!' });
  }
  if (!req.body.description) {
    errors.push({ text: 'Dude! You should add some text!' });
  }
  if (errors.length > 0) {
    res.render('notes/add', {
      errors: errors,
      title,
      description
    });
  } else {
    console.log(req.body);
    const newNote = {
      title,
      description,
      user: req.user.id
    };

    new Idea(newNote).save().then(idea => {
      req.flash('success_msg', 'Well done! A new note is added!');
      res.redirect('/notes');
    });
  }
});

router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    idea.title = req.body.title;
    idea.description = req.body.description;

    idea.save().then(idea => {
      console.log(chalk.yellow(idea));
      req.flash('success_msg', 'Note updated!');
      res.redirect('/notes');
    });
  });
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.deleteOne({ _id: req.params.id }).then(() => {
    req.flash('success_msg', 'Note deleted!');
    res.redirect('/notes');
  });
});

module.exports = router;
