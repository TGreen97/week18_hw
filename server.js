// DEPENDENCIES
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');

// Variables for Article and Message Models
var Article = require('./models/Article.js');
var Message = require('./models/Message.js');

// Utilizing Morgan & Body-Parser
app.use(logger('dev'));
app.use(bodyParser.urlencoded ({
  extended: false
}));

// Static Dir for Public folder
app.use(express.static('public'));

// Database configuration with Mongoose
mongoose.connect('mongodb://localhost/week18scrapeTag');
var db = mongoose.connection;

// Display Mongoose Errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// Log Success Message after accessing the db thru Mongoose
db.once('open', function() {
  console.log('Mongoose connection success!');
});

// =========== ROUTES ============

// Index Route
app.get('/', function(req, res) {
  res.send(index.html);
});

// GET to Scrape the echojs website
app.get('/scrape', function(req, res) {
// Use a request to grab the body of the HTML
  request('https://www.reddit.com/r/sports/', function(error, response, html) {
// Take body of HTML and load into Cheerio and save it to $ as a Selector
    var $ = cheerio.load(html);
// Grab every h2 within the article Tag and perform the function
    $('p.title').each(function(i, element) {
// Save an Empty Result Object
      var result = {};
// Add & Save Text & HREF of every link to Result Object
      result.title = $(this).children('a').text();
      result.link = $(this).children('a').attr('href');
// Use Article Model to create a new Entry
      var entry = new Article(result);
// Save Article Object to Entry
      entry.save(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
        }
      });
    });
  });
// Notification that the Scrape is finished
  res.send('Send Complete');
});

// GET articles scraped from mongoDB
app.get('/articles', function(req, res) {
  Article.find({}, function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(doc);
    }
  });
});

// GET article by its ObjectID
app.get('/articles/:id', function(req, res) {
// Use the ID from the parameter and prepare a query that finds the matching one in the db
  Article.findOne({'_id': req.params.id})
  .populate('message')
  .exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.json(doc);
    }
  });
});

// Replace an existing Message on an Article with a new one, and if no message exists for an Article, make the posted Message it's Message
app.post('/articles/:id', function(req, res) {
  var newMessage = new Message(req.body);

  newMessage.save(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      Article.findOneAndUpdate({'_id': req.params.id}, {'message':doc._id})
      .exec(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          res.send(doc);
        }
      });
    }
  });
});

// Listen on Port 3000
app.listen(3000, function() {
  console.log('App running on Port 3000!');
});