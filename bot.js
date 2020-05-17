const fs = require('fs');
var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
var cannel;

var retrieve = {};
var map = new Map();

function start(){
  fs.readFile('output.json',
    // callback function that is called when reading file is done
    function(err, data) { 
      
        var jsonData = data;
 
        // parse json
        retrieve = JSON.parse(jsonData);
        console.log(retrieve);
        map = new Map(Object.entries(retrieve));
    });
}

const toMap = ( obj => {
    var map = new Map();
    Object.keys ( obj ). forEach (k => { map.set(k, obj[k]) });
    return map;
});


var jsonObj = {};

function parseMap(){
  jsonObj = Object.fromEntries(map);
  // map.forEach((value, key) => {
  //   var keys = key.split('.'),
  //   last = keys.pop();
  //   keys.reduce((r, a) => r[a] = r[a] || {}, jsonObj)[last] = value;
  // });
}

function sort(){
  map[Symbol.iterator] = function* () {
    yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
  }
}

function save(){
  sort();
  parseMap();
  var jsonContent = JSON.stringify(jsonObj);
  fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
    if (err) {
      console.log("An error occured while writing JSON jsonObj to File.");
      return console.log(err);
    }
    console.log("saved");
  });
  start();
}

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';

var bot = new Discord.Client();
bot.login('NzExMjMxMTM3NTM1NDkyMTQ3.XsF2hQ.-NEDaRKzlWuR-W2N94Qtb1TnC98');

bot.on('ready', function (evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
  start();
});



bot.on('message', message => {
  if (message.content.substr(0, 1) == '^') {
      var args = message.content.split(" ");
      switch(args[0]) {
        // !ping
        case '^hi':
        // bot.react({});
          const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'notstonks');
          message.react(emoji);
          message.channel.send('stfu!');
          // bot.sendMessage({
          //   to: channelID,
          //   message: 'stfu!'
          // });
          break;
        case '^stonks':
          if(args.length != 3){
            message.channel.send('sorry, I didn\'t get that, type ^help to see the commands');
            break;
          }
          if(message.channel.id != '711604888370544652'){message.channel.send('wrong channel');break;}
          switch(map.has(args[1])){
            case true: 
              map.set(args[1], map.get(args[1]) + parseInt(args[2], 10));
              break;
            case false:
              map.set(args[1], parseInt(args[2], 10));
              break;
          }
          message.channel.send('added **' + args[2] + '** to **' + args[1] + '**\nnew rating: **' + map.get(args[1]).toString() + '**');
          // bot.sendMessage({
          //   to: channelID,
          //   message:'added **' + args[2] + '** to **' + args[1] + '**\nnew rating: **' + map.get(args[1]).toString() + '**'
          // });
          save();
          break;
        case '^get':
          if(args.length != 2){
            message.channel.send('sorry, I didn\'t get that, type ^help to see the commands');
            break;
          }
          switch(map.has(args[1])){
            case true:
              message.channel.send('**' + args[1] + '**\'s rating is ' + map.get(args[1]).toString());
              // bot.sendMessage({
              //   to:channelID,
              //   message:'**' + args[1] + '**\'s rating is ' + map.get(args[1]).toString()
              // });
              break;
            case false:
               message.channel.send('**' + args[1] + '** not found');
              // bot.sendMessage({
              //   to:channelID,
              //   message:'**' + args[1] + '** not found'
              // });
              break;
          }
          break;
        case '^notstonks':
          if(args.length != 3){
            message.channel.send('sorry, I didn\'t get that, type ^help to see the commands');
            break;
           }
          if(message.channel.id != '711604888370544652'){message.channel.send('wrong channel');break;}
          switch(map.has(args[1])){
            case true:
              map.set(args[1], map.get(args[1]) - parseInt(args[2], 10));
              message.channel.send('decreased **' + args[2] + '** from **' + args[1] + '**\nnew rating: **' + map.get(args[1]).toString() + '**');
              // bot.sendMessage({
              //  to: channelID,
              //  message:'decreased **' + args[2] + '** from **' + args[1] + '**\nnew rating: **' + map.get(args[1]).toString() + '**'
              // });
              break;
            case false:
              message.channel.send('**' + args[1] + '** not found');
              // bot.sendMessage({
              //   to:channelID,
              //   message:'**' + args[1] + '** not found'
              // });
              break;
          }
          save();
          break;
        case '^rm':
          if(args.length != 2){
            message.channel.send('sorry, I didn\'t get that, type ^help to see the commands');
            break;
          }
          if(message.channel.id != '711604888370544652'){message.channel.send('wrong channel');break;}
          switch(map.has(args[1])){
            case true:
              map.delete(args[1]);
              save();
              message.channel.send('removed **' + args[1] + '**');
              // bot.sendMessage({
              //  to: channelID,
              //  message:'removed **' + args[1] + '**'
              // });
              break;
            case false:
              message.channel.send('**' + args[1] + '** not found');
              // bot.sendMessage({
              //   to:channelID,
              //   message:'**' + args[1] + '** not found'
              // });
              break;
          }
          break;
        case '^buttom':
          var counter = 0;
          var hasil = "";
          map.forEach(function printList(values, key){
            ++counter;
            hasil += counter.toString() + '. **' + key + '** ' + values.toString() + '\n'
          //  bot.sendMessage({
          //  to: channelID,
          //  message: counter.toString() + '. **' + key + '** ' + values.toString()
          // });
         });
          if(hasil === ""){
            message.channel.send('nothing in the list');
            // bot.sendMessage({
            //  to: channelID,
            //   message: 'nothing in the list'
            // });
          } else {
            message.channel.send(hasil);
            // bot.sendMessage({
            //   to: channelID,
            //   message: hasil
            // });
          }
          break;
        case '^top':
          var counter = 0;
          var hasil = "";
          map.forEach(function printList(values, key){
            ++counter;
            hasil += counter.toString() + '. **' + key + '** ' + values.toString() + '\n'
          //  bot.sendMessage({
          //  to: channelID,
          //  message: counter.toString() + '. **' + key + '** ' + values.toString()
          // });
         });
          if(hasil === ""){
            message.channel.send('nothing in the list');
            // bot.sendMessage({
            //  to: channelID,
            //   message: 'nothing in the list'
            // });
          } else {
            message.channel.send(hasil);
            // bot.sendMessage({
            //   to: channelID,
            //   message: hasil
            // });
          }
          break;
        case '^help':
          var hasil = '';
          hasil += 'type:\n';
          hasil += '**^hi** to say hi\n';
          // hasil += '**^stonks <username> <score>** to add <score> to <username> => only admins\n';
          // hasil += '**^notstonks <username> <score>** to decrease <score> from <username> => only admins\n';
          hasil += '**^get <username>** to get <username>\'s rating\n';
          // hasil += '**^rm <username>** to remove <username> from the participant\'s list => only admins\n';
          hasil += '**^top** to list all participants with its ratings sorted descendingly\n';
          hasil += '**^help** to be stupid\n';
          message.channel.send(hasil);
          // bot.sendMessage({
          //    to: channelID,
          //     message: hasil
          // });
          break;
        case '^clear':
          map.clear();
          save();
          message.channel.send('cleared');
          break;
        default: 
          message.channel.send('sorry, I didn\'t get that, type ^help to see the commands');
          // bot.sendMessage({
          //  to: channelID,
          //  message: 'sorry, I didn\'t get that, type ^help to see the commands'
          // });
          break;
      }
    } else{
      var not = 0;
      var args = message.content.split(" ");
      var naik = 0;
      var turun = 0;
      var ga = 0;
      var rating = 0;
      args.forEach(function cek(cur){
        if(cur.substr(0, 5).toLowerCase() === "haram" || cur.substr(0, 7).toLowerCase() === "diharam"){
          const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'haram');
          message.react(emoji);
        }
        // if(cur === "69" || cur.toLowerCase() === "***peepee***" || cur.toLowerCase() === "peepee" || cur.toLowerCase() === "**peepee**" || cur.toLowerCase() === "*peepee*" || cur.toLowerCase() === "pp" || cur.toLowerCase() === "*pp*" || cur.toLowerCase() === "**pp**" || cur.toLowerCase() == "***pp***"){
        //   const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'stonks');
        //   message.react(emoji);
        // }
        if(cur.substr(0, 6).toLowerCase() === "stonks"){
          if(not == 1){
            const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'notstonks');
            message.react(emoji);
          } else{
            const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'stonks');
            message.react(emoji);
          }
        }
        if(cur.substr(0, 5).toLowerCase() === "thonk"){
          const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'thonkery');
          message.react(emoji);
        }
        // if(cur.substr(0, 3).toLowerCase() === "yes"){
        //   const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'exclamation');
        //   message.react(emoji);
        //   emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'NPNO');
        //   message.react(emoji);
        // }
        if(cur.toLowerCase() === "ac"){
          const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'AC');
          message.react(emoji);
        }
        if(cur.toLowerCase() === "wa"){
          const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'WA');
          message.react(emoji);
        }
        if(cur.toLowerCase() === "tle"){
          const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'TLE');
          message.react(emoji);
        }
        if(cur.toLowerCase() === "mle"){
          const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'MLE');
          message.react(emoji);
        }
        if(cur.toLowerCase() === "rte" || cur.toLowerCase() === "re"){
          const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'RE');
          message.react(emoji);
        }
        if(cur.substr(0, 3).toLowerCase() === "hai"){
          const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'dascohai');
          message.react(emoji);
        }
        if(cur.substr(0, 4).toLowerCase() === "bruh"){
          const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'novaryo');
          message.react(emoji);
        }
        if(cur.substr(0, 6).toLowerCase() === "rating"){
          if(naik == 0 && turun == 0)rating = 1;
          if(naik == 1){
            const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'stonks');
            message.react(emoji);
            naik = 0;
          }
          if(turun == 1){
            const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'notstonks');
            message.react(emoji);
            turun = 0;
          }
        }
        if(cur.substr(0, 4).toLowerCase() === "naik"){
          if(rating == 0) naik = 1;
          if(rating == 1){
            const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'stonks');
            message.react(emoji);
            naik = 0;
          }
        }
        if(cur.substr(0, 5).toLowerCase() === "turun"){
          if(rating == 0) turun = 1;
          if(rating == 1){
            const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'notstonks');
            message.react(emoji);
            turun = 0;
          }
        }
        if(cur.toLowerCase() === "not"){
          if(not == 1){
            not = 0;
          } else not = 1;
        } else if(not == 1)not = 0;
        // if(cur.toLowerCase() === "no" ){
        //   const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'NPNO');
        //   message.react(emoji);
        // }
        // if(cur.substr(0, 3).toLowerCase() === "noo" || cur.substr(0, 2) === ":(" || cur.substr(0, 2) === "):" || cur.substr(0, 2) === ");" || cur.substr(0, 2) === ";("){
        //   const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'notstonks');
        //   message.react(emoji);
        // }
        if(cur.toLowerCase() === "tk" || cur.substr(0, 4).toLowerCase() === "nani"){
          const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'maxinani');
          message.react(emoji);
        }
        // if(cur.substr(0, 2).toLowerCase() === "oh"){
        //   const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'pikatanoh');
        //   message.react(emoji);
        // }
        if(cur.toLowerCase() === "queueforces" || cur.substr(0, 7).toLowerCase() === "unrated" || cur.toLowerCase() === "ngebug" || cur === ":notstonks:"){
          const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'notstonks');
          message.react(emoji);
        }
        if(cur.substr(0, 3).toLowerCase() === "orz"){
          const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'ramaorz');
          message.react(emoji);
        }
      });
    }
});
