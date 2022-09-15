var express = require('express');
var Book = require('../models/Book');
var User = require('../models/User');

var router = express.Router();

// list all books
router.get('/', (req, res, next) => {
  Book.find({}, (err, books) => {
    if (err) return next(err);
    res.json({ books });
  });
});

// create new Book
router.post('/', (req, res, next) => {
  var data = req.body;
  Book.create(data, (err, createdBook) => {
    if (err) return next(err);
    res.json({ createdBook });
  });
});

// get single book
router.get('/:id', (req, res, next) => {
  var id = req.params.id;
  Book.findById(id, (err, book) => {
    if (err) return next(err);
    res.json({ book });
  });
});

// update a book
router.put('/:id', (req, res, next) => {
  var bookId = req.params.id;
  var data = req.body;
  Book.findByIdAndUpdate(bookId, data, (err, updatedBook) => {
    if (err) return next(err);
    res.json({ updatedBook });
  });
});

// delete a book
router.delete('/:id', (req, res, next) => {
  var bookId = req.params.id;
  Book.findByIdAndDelete(bookId, (err, deletedBook) => {
    if (err) return next(err);
    res.json({ deletedBook });
  });
});

module.exports = router;
