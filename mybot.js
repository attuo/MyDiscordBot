var Discord = require("discord.js");
var request = require("request");
var bot = new Discord.Client();
var fs = require('fs');
var config = require('./config.js');


// Where the user inputs are checked and will call some function
bot.on("message", msg => {
  // Set the prefix
  let prefix = "!";
  // Exit and stop if it's not there
  if(!msg.content.startsWith(prefix)) return;
  // Exit if any bot
  if(msg.author.bot) return;

  else if (msg.content.startsWith(prefix + "flipcoin")) {
    if (getRandomInteger(0, 1) === 1) {
      msg.channel.sendMessage("Heads!");
    }
    else msg.channel.sendMessage("Tails!");
  }
  else if (msg.content.startsWith(prefix + "roll")) {
    var text = msg.content;
    msg.channel.sendMessage(roll(text));
    }
  else if (msg.content.startsWith(prefix + "xkcdrandom")) {
    xkcdRandom(function (comicInfos) {
      msg.channel.sendMessage(comicInfos[0]);
      msg.channel.sendMessage("Alt text: " + comicInfos[1]);
    });
  }
  else if (msg.content.startsWith(prefix + "xkcdlatest")) {
    latestXkcd(function (comicInfos) {
      msg.channel.sendMessage(comicInfos[0]);
      msg.channel.sendMessage("Alt text: " + comicInfos[1]);
    });
  }
});


// Handles the function calling for random
//xkcd comic url and alt text with http request
function xkcdRandom(callback) {
  var min = 1;
  getLatestXkcdNumber(function(response) {
    var randomNumber = getRandomInteger(1, response);
    if (randomNumber === 404) getRandomInteger(1, response);
    var xkcdUrl = "http://xkcd.com/" + randomNumber + "/info.0.json";
    getXkcdUrlAndTitle(xkcdUrl, (function(response) {
      comicInfos = response;
      callback(comicInfos);
    })
  )
  });
}


// Handles the function calling for latest xkcd comic url and alt text with
// http request
function latestXkcd(callback) {
    getLatestXkcdNumber(function(response) {
    var latest = response;
    var xkcdUrl = "http://xkcd.com/" + latest + "/info.0.json";
    getXkcdUrlAndTitle(xkcdUrl, (function(response) {
      var comicInfos = response;
      callback(comicInfos);
    }))
});
}

// Funcion that get the latest xkcd comic number with http request
function getLatestXkcdNumber(callback) {
request('http://xkcd.com/info.0.json', (error, response, body) => {
        latestComicNum = JSON.parse(body)['num']
        callback(latestComicNum);
      });
    }


// Gets wanted xkcd url and title with http request
function getXkcdUrlAndTitle(url, callback) {
  var imgUrl;
  var imgAlt;
  request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      xkcdBody = JSON.parse(body);
      imgUrl = xkcdBody["img"];
      imgAlt = xkcdBody["alt"];
      var infos = [imgUrl, imgAlt];
      callback(infos);
    }
});
}


// Basic roll function that returns random value between min and max
function roll(str) {
  var rollResult;
  var wrongInput = "Wrong input, type for example !roll 1 20";

  var arrayText = str.split(" ");
  if ("!roll" === str) {
    rollResult = getRandomInteger(1, 10);
    return rollResult;
  }

  else if (arrayText.length === 3) {
    var min = Number(arrayText[1]);
    var max = Number(arrayText[2]);

      if (min < max && min !== NaN && max !== NaN) {
      rollResult = getRandomInteger(max, min);
      return rollResult;
      }
      else return wrongInput;
    }
    else return wrongInput;
  }


function isInteger(str) {
    var n = Math.floor(Number(str));
    return String(n) === str && n >= 0;
}


function getRandomInteger(min, max) {
  var result = Math.floor(Math.random() * (max - min + 1)) + min;
  return result;
}


function showError() {
  msg.channel.sendMessage("Error!");
}

// This is needed! Use your own bot's discord key and store it in different
// file
bot.login(config.discord.key);
