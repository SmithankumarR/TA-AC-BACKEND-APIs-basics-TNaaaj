var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: { type: String, require: true },
  email: { type: String, unique: true },
  password: String,
  books: { type: mongoose.Types.ObjectId, ref: 'Book' },
  comments: { type: mongoose.Types.ObjectId, ref: 'Comment' },
});

var User = mongoose.model('User', userSchema);

module.exports = User;
