const Discord = require('discord.js');
function getEloWinProbability(ra, rb){return 1.0 / (1.0 + Math.pow(10.0, ((rb - ra)) / 400.0));}

module.exports= {

  get: function(message, args, map){
    var ratings = [];
    for(var i = 1; i < args.length; i ++){
      if(map.has(args[i]) == 0){
        message.channel.send('**' + args[i] + '** not found');
        return;
      }
      ratings[ratings.length] = map.get(args[i]);
      // console.log(ratings[ratings.length - 1]);
    }
    var left = -100.0, right = 10000.0;
    for(var tt = 0; tt < 20; tt++){
      var r = (left + right) / 2.0;
      var rWinsProbability = 1.0;
      for(var i = 0.0; i < ratings.length; i++){
        rWinsProbability *= getEloWinProbability(r, ratings[i]);
        // console.log(rWinsProbability.toString());
      }
      if(rWinsProbability < 0.5){
        left = r;
      } else{
        right = r;
      }
    }
    hasil = args.join(', ');
    hasil = hasil.substr(11, hasil.length);
    const vieri = new Discord.MessageAttachment('./viericorp.png');
    message.channel.send({files: [vieri], embed: {
      color: 16764006,
      author: {
        name: hasil,
        icon_url: "https://cdn.discordapp.com/icons/688018099584237610/aaea71cdce8f697de559185cac6b4ced.png?size=256"
      },
      title:Math.round((left + right) / 2).toString(),
      timestamp: new Date(),
      footer: {
        icon_url: 'attachment://viericorp.png',
        text: "By Vieri Corp.™"
      }
    }
    });
  } 
}