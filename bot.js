let request = require(`request`);
var plotly = require('plotly')('juancarlovieri', "cFGB4qzuLQc1dTw67Z19");
const GoogleSpreadsheet = require('google-spreadsheet');
const {promisify} = require('util');
const fs = require('fs');
var Discord = require('discord.js');
var logger = require('winston');
var creds = require('./Duel rating-3d9d81aa83a7.json')
var auth = require('./auth.json');

function download(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
}


var hellos = ["hullo orz!", "hellaw", "how are you?", "howdy", "how do ye?", "piye kabare"];
var retrieve = {};
var map = new Map();

function printStudent(name){
  // console.log(channel);
  var hasil = '';
  // var hasil = [name._cn6ca, name.a, name.b, name.c, name.d, name.e, name.total];
  // hasil += `__**${name._cn6ca}**__\n`
  hasil += `**A**: ${name.a}\n`
  hasil += `**B**: ${name.b}\n`
  hasil += `**C**: ${name.c}\n`
  hasil += `**D**: ${name.d}\n`
  hasil += `**E**: ${name.e}\n`
  hasil += `**TOTAL**: ${name.total}\n`
  // hasil += '----------------------------------------\n';
  // bot.channels.cache.get(channel.id).send(hasil);
  // console.log(`Name: ${name._cn6ca}`);
  return hasil;
}

async function accessSpreadsheet(channel){
  const doc = new GoogleSpreadsheet('1gIqvphDvB5sBNyltdt2v0CkOrQM-QFBykAOsSOG2Txo');
  await promisify(doc.useServiceAccountAuth)(creds);
  const info = await promisify(doc.getInfo)();
  const sheet = info.worksheets[0];
  console.log(info.title);
  console.log(`Title: ${sheet.title}, Rows: ${sheet.rowCount}`);
  const rows = await promisify(sheet.getRows)({
    offset: 1
  });
  var arr = [];
  var nama = [];
  rows.forEach(row => {
  // console.log(row);
    nama[nama.length] = row._cn6ca;
    arr[arr.length] = printStudent(row);
  });
  bot.channels.cache.get(channel.id).send({embed: {
    color: 16764006,
    author: {
      name: info.title,
      icon_url: "https://cdn.discordapp.com/icons/688018099584237610/aaea71cdce8f697de559185cac6b4ced.png?size=256"
    },
    title: 'Ayo dukung tim favorit kalian!',
    fields: [{
      name: 'tim ' + nama[0],
      value: arr[0]
    },
    {
      name: "tim " + nama[1],
      value: arr[1]
    }],
    timestamp: new Date(),
    footer: {
      text: "By Vieri Corp.™"
    }
  }
  });
}

function start(){
  var obj = JSON.parse(fs.readFileSync("output.json", 'utf8'));
  map = new Map(Object.entries(obj));
  bot.user.setActivity('prabowo', { type: 'WATCHING' });
  // fs.readFile('output.json',
  //   // callback function that is called when reading file is done
  //   function(err, data) { 
  //       var obj = JSON.parse(data);
  //       console.log(obj);
  //       map = new Map(Object.entries(obj));
  //   });
}
var jsonObj = {};

function parseMap(){
  jsonObj = Object.fromEntries(map);
}

function sort(){
  map[Symbol.iterator] = function* () {
    yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
  }
}

function save(){
  sort();
  parseMap();
  console.log(jsonObj);
  var jsonContent = JSON.stringify(jsonObj);
  fs.writeFileSync("output.json", jsonContent, 'utf8', function (err) {
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
bot.login(auth.token);

bot.on('ready', bot => {
  start();
  console.log('bot ready');
});

function newHist(name, array){
  var test = {}
  test.a = 'test';
  test.b = array;
  var jsonContent = JSON.stringify(test);
  fs.writeFileSync("history/" + name + ".json", jsonContent, 'utf8', function(err){
    if(err){
      console.log("An error occured while writing JSON jsonObj to File.");
      return console.log(err);
    }
    console.log("saved");
  });
}

bot.on('message', message => {
  if (message.content.substr(0, 1) == '^') {
      var args = message.content.split(" ");
      switch(args[0]) {
        // !ping
        case '^hi':
          const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'dascohai');
          message.react(emoji);
          var min = 0;
          var max = 6;
          message.channel.send(hellos[Math.floor(Math.random() * (+max - +min)) + +min]);
          break;
        case '^stonks':
          if(args.length != 3){
            message.channel.send('sorry, I didn\'t get that, type ^help to see the commands');
            break;
          }
          if(message.channel.id != '711604888370544652'){message.channel.send('wrong channel');break;}
          if(parseInt(args[2]) <= 0){
            message.channel.send('enter a positive integer!');
            break;
          }
          switch(map.has(args[1])){
            case true: 
              var data = fs.readFileSync("history/" + args[1] + ".json", 'utf8')
              var arr = JSON.parse(data).b;
              arr[arr.length] = parseInt(args[2], 10) + arr[arr.length - 1];
              newHist(args[1], arr);
              map.set(args[1], map.get(args[1]) + parseInt(args[2], 10));
              break;
            case false:
              var temp = [parseInt(args[2], 10)];
              // console.log(temp);
              newHist(args[1], temp);
              map.set(args[1], parseInt(args[2], 10));
              break;
          }
          message.channel.send({embed: {
            color: 16764006,
            author: {
              name: args[1],
              icon_url: "https://cdn.discordapp.com/icons/688018099584237610/aaea71cdce8f697de559185cac6b4ced.png?size=256"
            },
            fields: [{
              name: "delta",
              value: '+' + args[2]
            },
            {
              name:"new rating",
              value: map.get(args[1]).toString()
            },
            ],
            timestamp: new Date(),
            footer: {
              text: "By Vieri Corp.™"
            }
          }
          });
          save();
          break;
        case '^graph':
          if(args.length != 2){
            message.channel.send('sorry, I didn\'t get that, type ^help to see the commands');
            break;
          }
          if(map.has(args[1]) == 0){
            message.channel.send("**" + args[1] * "** not found");
            break;
          }
          console.log("tes");
          var arr = JSON.parse(fs.readFileSync("history/" + args[1] + ".json", 'utf8')).b;
          console.log(arr);
          var trace1 = {
            x: [],
            y: [],
            type: "scatter"
          };
          trace1.y = arr;
          for(var i = 1; i < arr.length + 1; i++){
            trace1.x[trace1.x.length] = i * 10;
          }
          var data = [trace1];
          var graphOptions = {filename: args[1], fileopt: "overwrite"};
          plotly.plot(data, graphOptions, function (err, msg) {
            console.log(msg);
            download(msg.url + '.jpeg', 'display.png', function(){
              message.channel.send('**' + args[1] + '**\'s graph', {
                files:[
                  "display.png"
                ]
              });
            });
          });
          
          break;
        case '^notstonks':
          if(args.length != 3){
            message.channel.send('sorry, I didn\'t get that, type ^help to see the commands');
            break;
           }
          if(message.channel.id != '711604888370544652'){message.channel.send('wrong channel');break;}
          if(parseInt(args[2]) <= 0){
            message.channel.send('enter a positive integer!');
            break;
          }
          if(map.has(args[1]) == 0){
            message.channel.send('**' + args[1] + '** not found');
            break;
          }
          var arr = JSON.parse(fs.readFileSync("history/" + args[1] + ".json", 'utf8')).b;
          arr[arr.length] = arr[arr.length - 1] - parseInt(args[2], 10);
          newHist(args[1], arr);
          map.set(args[1], map.get(args[1]) - parseInt(args[2], 10));
          message.channel.send({embed: {
            color: 16764006,
            author: {
              name: args[1],
              icon_url: "https://cdn.discordapp.com/icons/688018099584237610/aaea71cdce8f697de559185cac6b4ced.png?size=256"
            },
            fields: [{
              name: "delta",
              value: '-' + args[2]
            },
            {
              name:"new rating",
              value: map.get(args[1]).toString()
            },
            ],
            timestamp: new Date(),
            footer: {
              text: "By Vieri Corp.™"
            }
          }
          });
          save();
          break;
        case '^rename':
          if(args.length != 3){
            message.channel.send('sorry, I didn\'t get that, type ^help to see the commands');
            break;
          }
          if(message.channel.id != '711604888370544652'){message.channel.send('wrong channel');break;}
          if(map.has(args[1]) == false){
            message.channel.send('**' + args[1] + '** not found');
            break;
          }
          var arr = JSON.parse(fs.readFileSync("history/" + args[1] + ".json", 'utf8')).b;
          var skor = map.get(args[1]);
          fs.unlinkSync("history/" + args[1] + ".json");
          map.delete(args[1]);
          newHist(args[2], arr);
          map.set(args[2], skor);
          save();
          message.channel.send('renamed **' + args[1] + '** to **' + args[2] + '**');
          break;
        case '^get':
          if(args.length != 2){
            message.channel.send('sorry, I didn\'t get that, type ^help to see the commands');
            break;
          }
          var hasil = "";
          if(map.has(args[1]) == false){
             message.channel.send('**' + args[1] + '** not found');
            break;
          }
          var arr = JSON.parse(fs.readFileSync("history/" + args[1] + ".json", 'utf8')).b;
          var history = ""; 
          arr.forEach(
            function(item, index){
            history += item.toString() + ' - ';
          });
          history = history.substr(0, history.length - 2);
          message.channel.send({embed: {
            color: 16764006,
            author: {
              name: args[1],
              icon_url: "https://cdn.discordapp.com/icons/688018099584237610/aaea71cdce8f697de559185cac6b4ced.png?size=256"
            },
            title: 'user info',
            fields: [{
              name: "current rating",
              value: map.get(args[1]).toString()
            },
            {
              name: "History",
              value: history
            },
            ],
            timestamp: new Date(),
            footer: {
              text: "By Vieri Corp.™"
            }
          }
          });
          break;
        case '^rm':
          if(args.length != 2){
            message.channel.send('sorry, I didn\'t get that, type ^help to see the commands');
            break;
          }
          if(message.channel.id != '711604888370544652'){message.channel.send('wrong channel');break;}
          switch(map.has(args[1])){
            case true:
              fs.unlinkSync("history/" + args[1] + ".json");
              map.delete(args[1]);
              save();
              message.channel.send('removed **' + args[1] + '**');
              break;
            case false:
              message.channel.send('**' + args[1] + '** not found');
              break;
          }
          break;
        case '^top':
          var counter = 0;
          var hasil = "";
          map.forEach(function printList(values, key){
            ++counter;
            hasil += counter.toString() + '. **' + key + '** ' + values.toString() + '\n'
          });
          if(hasil === ""){
            message.channel.send('nothing in the list');
          } else {
            message.channel.send({embed: {
              color: 16764006,
              author: {
                name: 'Duel Ratings',
                icon_url: "https://cdn.discordapp.com/icons/688018099584237610/aaea71cdce8f697de559185cac6b4ced.png?size=256"
              },
              title: "Top of the leaderboard",
              fields: [{
                name: "Sorted descendingly by rating",
                value: hasil
              }],
              timestamp: new Date(),
              footer: {
                text: "By Vieri Corp.™"
              }
            }
            });
          }
          break;
        case '^help':
          var hasil = '';
          hasil += 'type:\n';
          hasil += '**^hi** to say hi\n';
          // hasil += '**^stonks <username> <score>** to add <score> to <username> => only admins\n';
          // hasil += '**^notstonks <username> <score>** to decrease <score> from <username> => only admins\n';
          hasil += '**^get <username>** to get <username>\'s rating and its history\n';
          hasil += '**^graph <username>** to get <username>\'s rating graph\n';
          // hasil += '**^rm <username>** to remove <username> from the participant\'s list => only admins\n';
          hasil += '**^top** to list all participants with its ratings sorted descendingly\n';
          // hasil += '**^hist <username>** to get <username>\'s rating history\n';
          hasil += '**^score** to see currently running duel scoreboard\n';
          hasil += '**^help** to be stupid\n';
          message.channel.send(hasil);
          break;
        case '^clear':
          map.forEach(function buangHist(values, key){
            fs.unlinkSync("history/" + key + ".json");
          });
          map.clear();
          save();
          message.channel.send('cleared');
          break;
        case '^score':
          accessSpreadsheet(message.channel);
          break;
        default: 
          message.channel.send('sorry, I didn\'t get that, type ^help to see the commands');
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
