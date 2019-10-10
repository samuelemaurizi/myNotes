if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI:
      'mongodb+srv://samuele:noexmo@cluster0-j89nm.mongodb.net/test?retryWrites=true&w=majority'
  };
} else {
  module.exports = { mongoURI: 'mongodb://localhost/notes-app' };
}
