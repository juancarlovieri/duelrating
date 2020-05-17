const fs = require('fs');
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var retrieve = {};
var map = new Map();

fs.readFile('output.json',
    function(err, data) { 
        var jsonData = data;
        retrieve = JSON.parse(jsonData);
        console.log(retrieve);
        map = new Map(Object.entries(retrieve));
});


var jsonObj = {};

function parseMap(){
  jsonObj = Object.fromEntries(map);
}

function save(){
  parseMap();
  var jsonContent = JSON.stringify(jsonObj);
  fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
    if (err) {
      console.log("An error occured while writing JSON jsonObj to File.");
      return console.log(err);
    }
    console.log("saved");
  });
}

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';

var bot = new Discord.Client({
 token: auth.token,
 autorun: true
});

bot.on('ready', function (evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
});



bot.on('message', function (user, userID, channelID, message, evt) {
  if (message.substring(0, 1) == '^') {
      var args = message.split(" ");
      switch(args[0]) {
        case '^hi':
          bot.sendMessage({
            to: channelID,
            message: 'stfu!'
          });
          break;
        case '^stonks':
          switch(map.has(args[1])){
            case true: 
              map.set(args[1], map.get(args[1]) + parseInt(args[2], 10));
              break;
            case false:
              map.set(args[1], parseInt(args[2], 10));
              break;
          }
          bot.sendMessage({
            to: channelID,
            message:'added **' + args[2] + '** to **' + args[1] + '**\nnew rating: **' + map.get(args[1]).toString() + '**'
          });
          save();
          break;
        case '^get':
          switch(map.has(args[1])){
            case true:
              bot.sendMessage({
                to:channelID,
                message:'**' + args[1] + '**\'s rating is ' + map.get(args[1]).toString()
              });
              break;
            case false:
              bot.sendMessage({
                to:channelID,
                message:'**' + args[1] + '** not found'
              });
              break;
          }
          break;
        case '^notstonks':
          switch(map.has(args[1])){
            case true:
              map.set(args[1], map.get(args[1]) - parseInt(args[2], 10));
              bot.sendMessage({
               to: channelID,
               message:'decreased **' + args[2] + '** from **' + args[1] + '**\nnew rating: **' + map.get(args[1]).toString() + '**'
              });
              break;
            case false:
              bot.sendMessage({
                to:channelID,
                message:'**' + args[1] + '** not found'
              });
              break;
          }
          save();
          break;
        case '^rm':
          switch(map.has(args[1])){
            case true:
              map.delete(args[1]);
              save();
              bot.sendMessage({
               to: channelID,
               message:'removed **' + args[1] + '**'
              });
              break;
            case false:
              bot.sendMessage({
                to:channelID,
                message:'**' + args[1] + '** not found'
              });
              break;
          }
          break;
        case '^list':
          var counter = 0;
          var hasil = '';
          map.forEach(function printList(values, key){
            ++counter;
            hasil += counter.toString() + '. **' + key + '** ' + values.toString() + '\n'
         });
          if(hasil == ''){
            bot.sendMessage({
             to: channelID,
              message: 'nothing in the list'
            });
          } else {
            bot.sendMessage({
              to: channelID,
              message: hasil
            });
          }
          break;
        case '^help':
          var hasil = '';
          hasil += 'type:\n';
          hasil += '**^hi** to say hi\n';
          hasil += '**^stonks <username> <score>** to add <score> to <username>\n';
          hasil += '**^notstonks <username> <score>** to decrease <score> from <username>\n';
          hasil += '**^get <username>** to get <username>\'s rating\n';
          hasil += '**^rm <username>** to remove <username> from the participant\'s list\n';
          hasil += '**^list** to list all participants with its ratings\n';
          hasil += '**^help** to be stupid\n';
          bot.sendMessage({
             to: channelID,
              message: hasil
          });
          break;
        default: bot.sendMessage({
          to: channelID,
          message: 'sorry, I didn\'t get that, type ^help to see the commands'
        });
       }
   }
});
