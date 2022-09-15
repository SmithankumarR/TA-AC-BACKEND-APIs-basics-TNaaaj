var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
  title: { type: String, require: true },
  description: String,
  categories: [String],
  createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
  comments: { type: mongoose.Types.ObjectId, ref: 'Comment' },
});

var Book = mongoose.model('Book', bookSchema);

module.exports = Book;
