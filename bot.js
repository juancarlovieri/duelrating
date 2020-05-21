let request = require(`request`);
var plotly = require('plotly')('juancarlovieri', "cFGB4qzuLQc1dTw67Z19");
const GoogleSpreadsheet = require('google-spreadsheet');
const {promisify} = require('util');
const fs = require('fs');
const gamble = require('./gamble.js');
const graph = require('./graph.js');
const atcoder = require('./atcoder.js');
const teamrate = require('./teamrate.js');
var help = require('./help.json');
const react = require('./react.js');
var schedule = require('node-schedule');
var top = require('./top.js');
var Discord = require('discord.js');
var logger = require('winston');
var creds = require('./spreadsheet-api.json')
var auth = require('./auth.json');
var soal = require('./soal.json');
var atcoderApi = require("@odanado/atcoder-api");
var announce = require('./announce.js');
const getUserInfo = require('./getUserInfo');
var pscore = require('./printscore.js');
var datetime = new Date();
var tminus30min = new Date(soal.year, soal.month, soal.date, parseInt(soal.hour) - 1, parseInt(soal.minute) + 30, soal.second);
var tminustwohour = new Date(soal.year, soal.month, soal.date, parseInt(soal.hour) - 2, soal.minute, soal.second);
var onContest = new Date(soal.year, soal.month, soal.date, soal.hour, soal.minute, soal.second);



var hellos = ["hullo orz!", "hellaw", "how are you?", "howdy", "how do ye?", "piye kabare", "Sugeng Enjing", "halo orz!", "owo!", "uwu!"];
var retrieve = {};
var map = new Map();

async function accessSpreadsheet(message){
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
    arr[arr.length] = pscore.printScore(row, message);
  });
  const vieri = new Discord.MessageAttachment('./viericorp.png');
  message.channel.send({files: [vieri], embed: {
    color: 16764006,
    author: {
      name: info.title,
      icon_url: "https://cdn.discordapp.com/icons/688018099584237610/aaea71cdce8f697de559185cac6b4ced.png?size=256"
    },
    title: 'Ayo dukung tim favorit kalian! Partisipan duel kali ini adalah **' + nama[0] + '** melawan **' + nama[1] + '**',
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
      icon_url: 'attachment://viericorp.png',
      text: "Powered By Vieri Corp.™ All Rights Reserved."
    }
  }
  });
}


function start(){
  var obj = JSON.parse(fs.readFileSync("output.json", 'utf8'));
  map = new Map(Object.entries(obj));
  bot.user.setActivity('prabowo', { type: 'WATCHING' });
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
  test.a = "test";
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

var reminder = schedule.scheduleJob(tminus30min, function(){
  const logo = new Discord.MessageAttachment('./viericorp.png');
  bot.channels.cache.get('712323110048628746').send("Duel dalam 30 menit lagi! <@&700622705879416843>");
});

var reminder = schedule.scheduleJob(tminustwohour, function(){
  const logo = new Discord.MessageAttachment('./viericorp.png');
  bot.channels.cache.get('712323110048628746').send("Duel dalam dua jam lagi! <@&700622705879416843>");
});

var outSoal = schedule.scheduleJob(onContest, function(){
  const logo = new Discord.MessageAttachment('./viericorp.png');
  bot.channels.cache.get('711604888370544652').send({files: [logo], embed:{
    color: 16764006,
    author: {
      name: 'Soal duel',
      icon_url: "https://cdn.discordapp.com/icons/688018099584237610/aaea71cdce8f697de559185cac6b4ced.png?size=256"
    },
    title: 'IT\'S SHOWTIME',
    fields: [{
      name: "\u200b",
      value: soal.links,
      inline: true
    },
    ],
    timestamp: new Date(),
    footer: {
      icon_url: 'attachment://viericorp.png',
      text: "Powered By Vieri Corp.™"
    }
  }
  });
  bot.channels.cache.get('712323110048628746').send('Duel mulai! Ayo Dukung tim favorit kalian! <@&700622705879416843>');
});

bot.on('message', message => {
  if (message.content.substr(0, 1) == '^') {
      var args = message.content.split(" ");
      console.log(message.author.username + ' ' + message.author.lastMessageID);
      switch(args[0]) {
        // !ping
        case '^hi':
          var client = atcoderApi.AtcoderAPI();
          // cache.has(message.guild.roles.cache.get("711613259412799538"))
          // console.log(message.guild.roles.cache.get("711613259412799538"));
          const emoji = message.guild.emojis.cache.find(emoji => emoji.name === 'dascohai');
          message.react(emoji);
          var min = 0;
          var max = 10;
          message.channel.send(hellos[Math.floor(Math.random() * (+max - +min)) + +min]);
          break;
        case '^gamble':
          gamble.gamble(message, bot);
          break;
        case '^win':
          if(message.channel.id != '574031032936824853')message.channel.send('sorry, I didn\'t get that, type ^help to see the commands');
          else bot.channels.cache.get('712323110048628746').send("Duel selesai dan pemenangnya adalah: " + soal.winner);
          break;
        case '^announce':
          announce.announce(message, bot);
          break;
        case '^teamrate':
          teamrate.get(message, args, map);
          break;
        case '^stonks':
          if(args.length != 3){
            message.channel.send('sorry, I didn\'t get that, type ^help to see the commands');
            break;
          }
          if(message.member.roles._roles.has('711613259412799538') == false){
            message.channel.send('wrong person');
            break;
          }
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
          const vieri = new Discord.MessageAttachment('./viericorp.png');
          message.channel.send({files: [vieri], embed: {
            color: 16764006,
            author: {
              name: args[1],
              icon_url: "https://cdn.discordapp.com/icons/688018099584237610/aaea71cdce8f697de559185cac6b4ced.png?size=256"
            },
            fields: [{
              name: 'delta',
              // name: '\u200b',
              // value: "[b](https://www.youtube.com/watch?v=UfS4mhKpPV0)"
              value: '+' + args[2]
            },
            {
              name:"new rating",
              value: map.get(args[1]).toString()
            },
            ],
            timestamp: new Date(),
            footer: {
              icon_url: 'attachment://viericorp.png',
              text: "By Vieri Corp.™"
            }
          }
          });
          save();
          break;
        case '^notstonks':
          if(args.length != 3){
            message.channel.send('sorry, I didn\'t get that, type ^help to see the commands');
            break;
          }
          if(message.member.roles._roles.has('711613259412799538') == false){
            message.channel.send('wrong person');
            break;
          }
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
          const logo = new Discord.MessageAttachment('./viericorp.png');
          message.channel.send({files: [logo], embed: {
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
              icon_url: 'attachment://viericorp.png',
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
          if(message.member.roles._roles.has('711613259412799538') == false){
            message.channel.send('wrong person');
            break;
          }
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
          getUserInfo.printUserInfo(message, bot, args, map);
          break;
        case '^rm':
          if(args.length != 2){
            message.channel.send('sorry, I didn\'t get that, type ^help to see the commands');
            break;
          }
          if(message.member.roles._roles.has('711613259412799538') == false){
            message.channel.send('wrong person');
            break;
          }
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
        case '^atcoder':
          atcoder.contest();
          break;
        case '^top':
          top.print(message, map);
          break;
        case '^graph':
          graph.multiple(args, message, map);
          break;
        case '^help':
          message.channel.send(help.text);
          break;
        case '^clear':
          if(message.member.roles._roles.has('711613259412799538') == false){
            message.channel.send('wrong person');
            break;
          }
          map.forEach(function buangHist(values, key){
            fs.unlinkSync("history/" + key + ".json");
          });
          map.clear();
          save();
          message.channel.send('cleared');
          break;
        case '^score':
          accessSpreadsheet(message);
          break;
        default: 
          message.channel.send('sorry, I didn\'t get that, type ^help to see the commands');
          break;
      }
    } else{
      react.cek(message);
    }
});
