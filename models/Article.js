// DEPENDENCIES
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Create Article Schema
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }
});

// Create Article Model
var Article = mongoose.model('Article', ArticleSchema);
// Export the Model
module.exports = Article;