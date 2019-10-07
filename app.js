const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
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

// Handlebar Middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  const title = 'My Notes';
  res.render('index', {
    title
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
