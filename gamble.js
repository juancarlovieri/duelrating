const Discord = require("discord.js");
const fs = require("fs");
let request = require(`request`);
var plotly = require('plotly')('juancarlovieri', "cFGB4qzuLQc1dTw67Z19");
var obj = JSON.parse(fs.readFileSync("gambles.json", "utf8"));
const soal = require("./soal.json");
var map = new Map(Object.entries(obj));
obj = JSON.parse(fs.readFileSync("balance.json", "utf8"));
var balance = new Map(Object.entries(obj));
obj = JSON.parse(fs.readFileSync("bankrupt.json", "utf8"));
var bankrupt = new Map(Object.entries(obj));
function download(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
}

function sort() {
  balance[Symbol.iterator] = function*() {
    yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
  };
}

function save() {
  sort();
  console.log('tes');
  var jsonObj = Object.fromEntries(map);
  console.log(jsonObj);
  var jsonContent = JSON.stringify(jsonObj);
  fs.writeFileSync("gambles.json", jsonContent, "utf8", function(err) {
    if (err) {
      console.log("An errr occured while writing JSON jsonObj to File.");
      return console.log(err);
    }
    console.log("saved");
  });
  jsonObj = Object.fromEntries(balance);
  console.log(jsonObj);
  var jsonContent = JSON.stringify(jsonObj);
  fs.writeFileSync("balance.json", jsonContent, "utf8", function(err) {
    if (err) {
      console.log("error when writing balance");
    }
    console.log("balance saved");
    obj = JSON.parse(fs.readFileSync("balance.json", "utf8"));
    balance = new Map(Object.entries(obj));
  });
  jsonObj = Object.fromEntries(bankrupt);
  console.log(jsonObj);
  var jsonContent = JSON.stringify(jsonObj);
  fs.writeFileSync("bankrupt.json", jsonContent, "utf8", function(err) {
    if (err) {
      console.log("error when writing bankrupt");
    }
    console.log("bankrupt saved");
  });
}

module.exports = {
  gamble: function(message, bot) {
    save();
    if (balance.has(message.author.username) == 0) {
      bankrupt.set(message.author.username, 0);
      balance.set(message.author.username, 1000);
      var test = {};
      test.a = "test";
      test.b = [1000];
      var jsonContent = JSON.stringify(test);
      fs.writeFileSync("gambhist/" + message.author.username + ".json", jsonContent, "utf8", function(
        err
      ) {
        if (err) {
          console.log("An error occured while writing JSON jsonObj to File.");
          return console.log(err);
        }
        console.log("saved");
      });
    }
    var args = message.content.split(" ");
    if(args[1] === "top"){
      sort();
      var hasil = "";
      var counter = 1;
      balance.forEach(function print(values, key){
        bankrupt.forEach(function print(values2, key2){
          if(key == key2){
            hasil += counter.toString() + '. **' + key + ';** balance: ' + values + ', bankrupts: ' + values2 + '\n';
            ++counter;
          }
        });
      });
      message.channel.send({
      embed: {
        color: 16764006,
        author: {
          name: "Balance top leaderboard",
          icon_url:
            "https://cdn.glitch.com/26db690e-dea6-4ed8-99ce-6a387ce927ce%2Ficon.png?1590286586993"
        },
        fields: [
          {
            name: 'Sorted descendingly by balance',
            value: hasil
          },
        ],
        timestamp: new Date(),
        footer: {
          icon_url:
            "https://cdn.glitch.com/26db690e-dea6-4ed8-99ce-6a387ce927ce%2Fthumbnails%2Fviericorp.png?1590286591495",
          text: "By Vieri Corp.™"
        }
      }
      });
      console.log(hasil);
      return;
    }
    if(args[1] === "graph"){
      var data = [];
      var names = 'graph for ';
      var temp = '';
      var flag = 0;
      for(var i = 2; i < args.length; i++){
        if(args[i][0] == '"'){
          temp += args[i].substr(1, args[i].length - 1);
          flag = 1;
          continue;
        }
        if(flag){
          if(args[i][args[i].length - 1] == '"'){
            flag = 0;
            temp += ' ' + args[i].substr(0, args[i].length - 1);
          } else{
            temp += ' ' + args[i];
            continue;
          }
        } else{
          temp = args[i];
        }
        console.log(temp);
        names += temp + ', ';
        if(balance.has(temp) == 0){
          message.channel.send('**' + temp + '** not found');
          return;
        }
        var haha = {
          x: [],
          y: [],
          name: temp,
          type: "scatter"
        };
        haha.y = JSON.parse(fs.readFileSync("gambhist/" + temp + ".json", 'utf8')).b;
        for(var j = 0; j < haha.y.length; j++){
          haha.x[haha.x.length] = j;
        }
        data[data.length] = haha;
      }
      if(flag){
        message.channel.send("***bruh odd number of quotation marks***");
        return;
      }
      var graphOptions = {filename: 'umum', fileopt: "overwrite"};
      plotly.plot(data, graphOptions, function (err, msg) {
        console.log(msg);
        download(msg.url + '.jpeg', 'display.png', function(){
          message.channel.send(names, {
            files: [
              "display.png"
            ]
          });
        });
      });
      return;
    }
    if (args[1] === "count") {
      if (message.channel.id != "574031032936824853") {
        message.channel.send(
          "sorry, I didn't get that, type ^help to see the commands"
        );
        return;
      }
      map.forEach(function(value, key) {
        var hist = JSON.parse(fs.readFileSync("gambhist/" + key + ".json", 'utf8')).b;
        console.log(value);
        if (value[1] == soal.teamWinner) {
          balance.set(key, balance.get(key) + value[0]);
        } else {
          balance.set(key, balance.get(key) - value[0]);
        }
        if (balance.get(key) == 0) {
          bankrupt.set(key, bankrupt.get(key) + 1);
          balance.set(key, 100);
          bot.channels.cache
            .get("711604888370544652")
            .send(key + " has gone bankrupt!");
        }
        hist[hist.length] = balance.get(key);
        var test = {};
        test.a = "test";
        test.b = hist;
        var jsonContent = JSON.stringify(test);
        fs.writeFileSync("gambhist/" + key + ".json", jsonContent, "utf8", function(
          err
        ) {
          if (err) {
            console.log("An error occured while writing JSON jsonObj to File.");
            return console.log(err);
          }
          console.log("saved");
        });
      });
      map.clear();
      save();
      bot.channels.cache
        .get("711604888370544652")
        .send("the gamblings have been counted!");
      return;
    }
    if (args[1] === "bal") {
      var temp = {
        x: [],
        y: [],
        name: message.author.username,
        type: "scatter"
      };
      temp.y = JSON.parse(fs.readFileSync("gambhist/" + message.author.username + ".json", 'utf8')).b;
      for(var j = 0; j < temp.y.length; j++){
        temp.x[temp.x.length] = j;
      }
      var data = [temp];
      var graphOptions = {filename: 'umum', fileopt: "overwrite"};
      plotly.plot(data, graphOptions, function (err, msg) {
        console.log(msg);
        download(msg.url + '.jpeg', 'display.png', function(){
        const file = new Discord.MessageAttachment('./display.png');
        message.channel.send({files: [file],
          embed: {
            color: 16764006,
            author: {
              name: message.author.username + "'s balance",
              icon_url:
                "https://cdn.glitch.com/26db690e-dea6-4ed8-99ce-6a387ce927ce%2Ficon.png?1590286586993"
            },
            fields: [
              {
                name: "balance",
                value: balance.get(message.author.username).toString()
              },
              {
                name: "number of bankrupt",
                value: bankrupt.get(message.author.username).toString()
              }
            ],
            image:{
              url: 'attachment://display.png'
            },  
            timestamp: new Date(),
            footer: {
              icon_url:
                "https://cdn.glitch.com/26db690e-dea6-4ed8-99ce-6a387ce927ce%2Fthumbnails%2Fviericorp.png?1590286591495",
              text: "By Vieri Corp.™"
            }
          }
        });
        });
      });
      return;
    }
    if (args[1] === "get") {
      if (map.has(message.author.username) == 1) {
        var temp = map.get(message.author.username);
        message.channel.send(
          "you gambled " + temp[0] + " owopiah for team " + temp[1]
        );
        return;
      } else {
        message.channel.send("you haven't gambled yet");
        return;
      }
    }
    if (args[1] == "reset") {
      if (soal.contestStatus == "ongoing") {
        message.channel.send(
          "the duel is ongoing, cannot take back your gamble!"
        );
        return;
      }
      map.delete(message.author.username);
      save();
      message.channel.send("aww why did you take back your gamble");
      return;
    }
    var arr = [];
    if (args.length != 3) {
      message.channel.send(
        "sorry, I didn't get that, type ^help to see the commands"
      );
      return;
    }
    if (map.has(message.author.username) == 1) {
      var temp = map.get(message.author.username);
      console.log(temp);
      message.channel.send(
        "you've gambled " + temp[0] + " owopiah for team " + temp[1]
      );
      return;
    }
    if (isNaN(args[1])) {
      message.channel.send("enter a positive integer to gamble!");
      return;
    }
    args[2] = args[2].toUpperCase();
    if (args[2] != "A" && args[2] != "B") {
      message.channel.send("you can only vote for team A or B!");
      return;
    }
    if (parseInt(args[1]) > balance.get(message.author.username)) {
      message.channel.send("you cannot gamble more than the money you have!");
      return;
    }
    if (soal.contestStatus == "ongoing") {
      message.channel.send("the duel is ongoing, cannot gamble!");
      return;
    }
    arr[0] = parseInt(args[1]);
    arr[1] = args[2];
    map.set(message.author.username, arr);
    save();
    message.channel.send(
      "thank you for gambling " + args[1] + " owopiah for team " + args[2]
    );
  }
};
