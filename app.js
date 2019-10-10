const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const chalk = require('chalk');
const flash = require('connect-flash');
const session = require('express-session');

const notes = require('./routes/notes');
const users = require('./routes/users.js');

const db = require('./config/db');

// Passport Config
require('./config/passport')(passport);

const app = express();

// Connect to mongoose
mongoose
  .connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log(chalk.green('Connected to MongoDB...')))
  .catch(err => console.log(chalk.red(err)));

/////////////////////////////
// MIDDLEWARES
/////////////////////////////
// Handlebar Middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Method Override
app.use(methodOverride('_method'));

// Express Session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

/////////////////////////////
// ROUTES
/////////////////////////////
app.get('/', (req, res) => {
  const title = 'My Notes';
  res.render('index', {
    title
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.use('/notes', notes);
app.use('/users', users);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
