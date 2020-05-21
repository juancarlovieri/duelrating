const Discord = require('discord.js');
const fs = require('fs');
var obj = JSON.parse(fs.readFileSync("gambles.json", 'utf8'));
const soal = require('./soal.json');
var map = new Map(Object.entries(obj));
obj = JSON.parse(fs.readFileSync('balance.json', 'utf8'));
var balance = new Map(Object.entries(obj));
obj = JSON.parse(fs.readFileSync('bankrupt.json', 'utf8'));
var bankrupt = new Map(Object.entries(obj));

function save(){
  var jsonObj = Object.fromEntries(map);
  console.log(jsonObj);
  var jsonContent = JSON.stringify(jsonObj);
  fs.writeFileSync('gambles.json', jsonContent, 'utf8', function (err) {
    if (err) {
      console.log("An error occured while writing JSON jsonObj to File.");
      return console.log(err);
    }
    console.log("saved");
  });
  jsonObj = Object.fromEntries(balance);
  console.log(jsonObj);
  var jsonContent = JSON.stringify(jsonObj);
  fs.writeFileSync('balance.json', jsonContent, 'utf8', function (err){
    if(err){
      console.log('error when writing balance');
    }
    console.log("balance saved");
  });
  jsonObj = Object.fromEntries(bankrupt);
  console.log(jsonObj);
  var jsonContent = JSON.stringify(jsonObj);
  fs.writeFileSync('bankrupt.json', jsonContent, 'utf8', function (err){
    if(err){
      console.log('error when writing bankrupt');
    }
    console.log("bankrupt saved");
  });
}

module.exports = {
  gamble: function(message, bot){
    if(balance.has(message.author.username) == 0){
      bankrupt.set(message.author.username, 0);
      balance.set(message.author.username, 1000);
    }
    var args = message.content.split(" ");
    if(args[1] === "count"){
      if(message.channel.id != '574031032936824853'){message.channel.send('sorry, I didn\'t get that, type ^help to see the commands');return;}
      map.forEach(function(value, key){
        console.log(value);
        if(value[1] == soal.teamWinner){
          balance.set(key, balance.get(key) + value[0]);
        } else{
          balance.set(key, balance.get(key) - value[0]);
        }
        if(balance.get(key) == 0){
          bankrupt.set(key, bankrupt.get(key) + 1);
          balance.set(key, 100);
          bot.channels.cache.get('711604888370544652').send(key + ' has gone bankrupt!');
        }
      });
      map.clear();
      save();
      bot.channels.cache.get('711604888370544652').send('the gamblings have been counted!');
      return;
    }
    if(args[1] === "bal"){
      const vieri = new Discord.MessageAttachment('./viericorp.png');
      message.channel.send({files: [vieri], embed: {
        color: 16764006,
        author: {
          name: message.author.username + '\'s balance',
          icon_url: "https://cdn.discordapp.com/icons/688018099584237610/aaea71cdce8f697de559185cac6b4ced.png?size=256"
        },
        fields: [{
          name: 'balance',
          value: balance.get(message.author.username).toString()
        },
        {
          name: 'number of bankrupt',
          value: bankrupt.get(message.author.username).toString()
        }],
        timestamp: new Date(),
        footer: {
          icon_url: 'attachment://viericorp.png',
          text: "By Vieri Corp.™"
        }
      }
      });
      return;
    }
    if(args[1] === "get"){
      if(map.has(message.author.username) == 1){
        var temp = map.get(message.author.username);
        message.channel.send('you gambled ' + temp[0] + ' owopiah for team ' + temp[1]);
        return;
      } else{
        message.channel.send('you haven\'t gambled yet');
        return;
      }
    }
    if(args[1] == "reset"){
      if(soal.contestStatus == "ongoing"){
        message.channel.send('the duel is ongoing, cannot take back your gamble!');
        return;
      }
      map.delete(message.author.username);
      save();
      message.channel.send('aww why did you take back your gamble');
      return;
    }
    var arr = [];
    if(args.length != 3){
      message.channel.send('sorry, I didn\'t get that, type ^help to see the commands');
      return;
    }
    if(map.has(message.author.username) == 1){
      var temp = map.get(message.author.username);
      console.log(temp);
      message.channel.send('you\'ve gambled ' + temp[0] + ' owopiah for team ' + temp[1]);
      return;
    }
    if(isNaN(args[1])){
      message.channel.send('enter a positive integer to gamble!');
      return;
    }
    args[2] = args[2].toUpperCase();
    if(args[2] != 'A' && args[2] != 'B'){
      message.channel.send('you can only vote for team A or B!');
      return;
    }
    if(parseInt(args[1]) > balance.get(message.author.username)){
      message.channel.send('you cannot gamble more than the money you have!');
      return;
    }
    arr[0] = parseInt(args[1]);
    arr[1] = args[2];
    map.set(message.author.username, arr);
    save();
    message.channel.send('thank you for gambling ' + args[1] + ' owopiah for team ' + args[2]);
  }
}