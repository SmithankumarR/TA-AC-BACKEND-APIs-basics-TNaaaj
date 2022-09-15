var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  title: String,
  description: String,
  createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
  Book: { type: mongoose.Types.ObjectId, ref: 'Book' },
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;