const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const chalk = require('chalk');

const app = express();

// Connect to mongoose
mongoose
  .connect('mongodb://localhost/notes-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log(chalk.green('Connected to MongoDB...')))
  .catch(err => console.log(chalk.red(err)));

// Import the Model Idea
require('./models/Idea');
const Idea = mongoose.model('idea');

/////////////////////////////
// MIDDLEWARES

// Handlebar Middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Method Override
app.use(methodOverride('_method'));

/////////////////////////////
// ROUTES
app.get('/', (req, res) => {
  const title = 'My Notes';
  res.render('index', {
    title
  });
});

app.get('/notes', (req, res) => {
  Idea.find({})
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('notes/index', {
        ideas
      });
    });
});

app.get('/notes/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    res.render('notes/edit', {
      idea
    });
  });
});

app.get('/notes/add', (req, res) => {
  res.render('notes/add');
});

app.post('/notes', (req, res) => {
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
      description
    };

    new Idea(newNote).save().then(idea => {
      res.redirect('/notes');
    });
  }
});

app.put('/notes/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    idea.title = req.body.title;
    idea.description = req.body.description;

    idea.save().then(idea => {
      console.log(chalk.yellow(idea));
      res.redirect('/notes');
    });
  });
});

app.delete('/notes/:id', (req, res) => {
  Idea.deleteOne({ _id: req.params.id }).then(() => {
    res.redirect('/notes');
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
