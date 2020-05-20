var Discord = require('discord.js');
module.exports =  {
  print: function(message, map){
    var counter = 0;
    var hasil = "";
    map.forEach(function printList(values, key){
      ++counter;
      hasil += counter.toString() + '. **' + key + '** ' + values.toString() + '\n'
    });
    if(hasil === ""){
      message.channel.send('nothing in the list');
    } else {
      const vieri = new Discord.MessageAttachment('./viericorp.png');
      message.channel.send({files: [vieri], embed: {
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
          icon_url: 'attachment://viericorp.png',
          text: "By Vieri Corp.™"
        }
      }
      });
    }
  }
}