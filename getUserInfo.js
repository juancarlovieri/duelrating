const Discord = require('discord.js');
const fs = require('fs');
let request = require(`request`);
var plotly = require('plotly')('juancarlovieri', "cFGB4qzuLQc1dTw67Z19");


function download(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
}

module.exports = {
  printUserInfo: function(message, bot, args, map){
    if(args.length != 2){
      message.channel.send('sorry, I didn\'t get that, type ^help to see the commands');
      return;
    }
    var hasil = "";
    if(map.has(args[1]) == false){
       message.channel.send('**' + args[1] + '** not found');
      return;
    }
    var arr = JSON.parse(fs.readFileSync("history/" + args[1] + ".json", 'utf8')).b;
    var history = ""; 
    arr.forEach(
      function(item, index){
      history += item.toString() + ' - ';
    });
    history = history.substr(0, history.length - 2);
    arr = JSON.parse(fs.readFileSync("history/" + args[1] + ".json", 'utf8')).b;
    console.log(arr);
    var trace1 = {
      x: [],
      y: [],
      type: "scatter"
    };
    trace1.y = arr;
    for(var i = 0; i < arr.length; i++){
      trace1.x[trace1.x.length] = i;
    }
    var data = [trace1];
    var graphOptions = {filename: args[1], fileopt: "overwrite"};
    plotly.plot(data, graphOptions, function (err, msg) {
      console.log(msg);
      download(msg.url + '.jpeg', 'display.png', function(){
        const file = new Discord.MessageAttachment('./display.png');
        const vieri = new Discord.MessageAttachment('./viericorp.png');
        const text = {
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
          image:{
            url: 'attachment://display.png'
          },  
          timestamp: new Date(),
          footer: {
            icon_url: 'attachment://viericorp.png',
            text: "Powered By Vieri Corp.™ ALl Rights Reserved."
          },
        };
        message.channel.send({files: [file, vieri], embed: text})
      });
    });
  }
}