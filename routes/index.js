var express = require('express');
var router = express.Router();
var Twitter = require('twitter')

class Tweet {
  constructor(author, msg) {
    this.author = author;
    this.message = msg;
  }
}
let Tweets = [];
let Topic = 'tennessee';
// TODO: Move to env variables
var client = new Twitter ({
  consumer_key: 'E2u0Wq5PKgDQgN3MsVVW5hJNb',
  consumer_secret: 'UuLZXf4eP2B0Ujm4jdqLSpfOZ7esxxdr32XQDsVEllMXV6THdl',
  access_token_key: '1263476735468810242-Npy4O7ec8G7v4758odM6oQm18rYPYF',
  access_token_secret: '2nHnbt3jP3FhWOR4Ri50SAZM6jto4MmuOjT3gPAXqndcM'
  //bearer_token: 'AAAAAAAAAAAAAAAAAAAAANVHEgEAAAAASRUZaKwErYfGvALqmSffLpX01LY%3D41Nbk7Huo6P4rDFcVEClkYngqHMV63nqCAAatFOu6FAMkhGD5G'
})

var stream = client.stream('statuses/filter', {track: Topic});
stream.on('data', function(event) {
  Tweets.unshift(new Tweet(event.user.name, event.text));
  if (Tweets.length > 10) { Tweets.pop(); }
})

stream.on('error', function(error) {
  console.log(error)
  throw error;
});

// Trending
newTrendingTweet = new Tweet('test', 'test');

// 2471217 Philidelphia
var trend = 'kentucky'; // This is repalced below by an actually rending topic, but this makes the compiler happy
client.get('trends/place', {id: 1}, function(error, tweets, response) {
  if(error) throw error;

  trend = tweets[0].trends[0].name;

  var trendingStream = client.stream('statuses/filter', {track: trend});
  trendingStream.on('data', function(event) {
    newTrendingTweet.author = event.user.name
    newTrendingTweet.message = event.text;
  })
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Com Tweet Filter', tweets: Tweets, filter_topic: Topic, trending_tweet: newTrendingTweet });
});

module.exports = router;