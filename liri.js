//grab the data from keys.js and store it into a variable to use
//list all NPM packages needed
var fs = require('fs');
var request = require('request');
var Twitter = require("twitter");
var spotify = require('spotify');
var keys = require("./keys.js");
var params = process.argv.slice(2);
commands(params);

//set functions for each liri command
function commands (command) {
  switch (command[0]) {
    case "my-tweets":
      getTweets();
      break;

    case "spotify-this-song":
      spotifyIt(command);
      break;

    case "movie-this":
      getMovie(command);
      break;

    case "do-what-it-says":
      doFile();
      break;
//if user doesn't write any parameters, display the options
    default:
      console.log("I'm sorry, I did not understand you.  Please choose command:\n'my-tweets'\n'spotify-this-song\n'movie-this'\n'do-what-it-says'"); 
  }
}

function getTweets () {
  var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
  });
// get last 20 tweets
  client.get('statuses/user_timeline', {screen_name: 'rowie_j'},  function(response){
    for (var i = 0; i < 20; i++) {
      console.log(response[i]);   
    }
  });
}

function spotifyIt (song) {
  var songTitle;
  //if user doesn't put in a song title, show whats my name again
    if (songTitle === "") {
      console.log("what’s my age again");
    } 
    else {
      songTitle = song[1];
      for (var i = 2; i < song.length; i++) {
        songTitle += " " + song[i];
    }
  }

    spotify.search({ type: 'track', query: songTitle }, function(err, data) {
      var data = data.tracks.items[0];
        console.log("Artist: " + data.artists[0].name);
        console.log("Song: " + data.name);
        console.log("Link: " + data.preview_url);
        console.log("Album: " + data.album.name + "\n");
        var data = "Artist: " + data.artists[0].name;
    });
}

function getMovie(movie) {
  var movieTitle;
//if user doesn't put in a movie title, display mr nobody
    if (movie === "") {
      movieTitle = "Mr.Nobody";
      console.log(movieTitle);
    } 
    else {
      movieTitle = movie[1];
      for (var i = 2; i < movie.length; i++) {
        movieTitle += " " + movie[i];
      }
    }
  //print out response  
  var url = "http://www.omdbapi.com/?t=" + movieTitle;
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var movieDetails = JSON.parse(body);
      console.log("Title: " + movieDetails.Title);
      console.log("Year: " + movieDetails.Year);
      console.log("IMDB Rating: " + movieDetails.imdbRating);
      console.log("Country: " + movieDetails.Country);
      console.log("Language: " + movieDetails.Language);
      console.log("Plot: " + movieDetails.Plot);
      console.log("Actors: " + movieDetails.Actors);
    }
  });
}


function doFile () {
  fs.readFile("./random.txt", "utf8", (err, data) => {
    data = data.replace(/\n/g, ',').split(",");
      for (var i = 0; i < data.length; i += 2) {
        var sendData = [data[i], data[i+1]];
        commands(sendData);
      }
  });
}
