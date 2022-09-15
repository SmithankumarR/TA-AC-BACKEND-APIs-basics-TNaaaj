var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  title: String,
  likes: { type: String, default: 0 },
  createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
  Book: { type: mongoose.Types.ObjectId, ref: 'Book' },
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
