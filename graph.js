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

module.exports={
  multiple: function(args, message, map){
    var data = [];
    console.log(args.length);
    var names = 'graph for';
    for(var i = 1; i < args.length; i++){
      names += ' ' + args[i];
      console.log(i);
      if(map.has(args[i]) == 0){
        message.channel.send('**' + args[i] + '** not found');
        return;
      }
      var temp = {
        x: [],
        y: [],
        name: args[i],
        type: "scatter"
      };
      temp.y = JSON.parse(fs.readFileSync("history/" + args[i] + ".json", 'utf8')).b;
      for(var j = 0; j < temp.y.length; j++){
        temp.x[temp.x.length] = j;
      }
      console.log(temp);
      data[data.length] = temp;
    }
    console.log(data);
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
  }
}