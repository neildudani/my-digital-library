const Book = require('../../database/models.js');
const { token } = require('../config.js');
const axios = require('axios');

exports.addBook = (req, res) => {

  let doc = {
    title: req.body.title,
    author: req.body.author,
    photo_url: req.body.photo_url,
    rating: null,
    summary: '',
    lesson: '',
    colour: req.body.colour
  };

  Book.find({title: req.body.title}).exec((error, book) => {

    if (error) {
      console.log('error: ', error);
      res.send('Please try again');
    } else {
      if (book.length > 0) {
        res.send('You already have a copy of this book in your library');
      } else {
        let newBook = new Book(doc);
        newBook.save(function(error, doc) {
          if (error) {
            console.log('error: ', error);
            res.send('Please try again');
          } else {
            res.send('Successfully added book to library!');
          }
        });
      }
    }
  })

};

exports.searchBooks = async (req, res) => {

  let searchTerm = req.query.searchTerm;
  let refactoredSearchTerm = searchTerm.replaceAll(' ', '+');
  let url = `https://www.googleapis.com/books/v1/volumes?q=${refactoredSearchTerm}&maxResults=10&printType=books&projection=lite`;
  let options = {
    headers: {
      key: token
    }
  }
  let books = await axios.get(url, options);
  res.send(books.data.items);
};

exports.fetchBooks = (req, res) => {

  Book.find({}).exec((error, books) => {
    if (error) {
      console.log('error: ', error);
      res.send('Unable to fetch books!');
    } else {
      res.send(books);
    }
  })

};

exports.setRating = (req, res) => {
  Book.findOneAndUpdate({title: req.body.title}, {rating: req.body.rating}, {upsert: true, new: true})
    .then(() => {
      res.send('Set rating succesfully');
    })
}

exports.addReview = (req, res) => {
  Book.findOneAndUpdate({title: req.body.title}, {lesson: req.body.lesson, summary: req.body.summary}, {upsert: true, new: true})
  .then(() => {
    res.send('Set rating succesfully');
  })
}