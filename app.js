const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

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
