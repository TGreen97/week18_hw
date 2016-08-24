var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  title: {
    type: String
  },
  body: {
    type: String
  }
});
// Create the Message Model with the Message Schema
var Message = mongoose.model('Message', MessageSchema);
// Export the Message Model
module.exports = Message;