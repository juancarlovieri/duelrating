var Discord = require('discord.js');
const soal = require('./soal.json');

module.exports = {
  announce: function(message, bot){
    if(message.channel.id != '574031032936824853'){message.channel.send('sorry, I didn\'t get that, type ^help to see the commands');return;}
    var peserta = soal.participantone + ' vs ' + soal.participanttwo;
    const vierilogo = new Discord.MessageAttachment('./viericorp.png');
    bot.channels.cache.get('712323110048628746').send({files: [vierilogo], embed: {
      color: 16764006,
      author: {
        name: 'Pengumuman ' + soal.name,
        icon_url: "https://cdn.discordapp.com/icons/688018099584237610/aaea71cdce8f697de559185cac6b4ced.png?size=256"
      },
      title: 'Ayo dukung tim favorit kalian!',
      fields: [{
        name: 'Waktu',
        value: soal.time
        // value: '+' + args[2]
      },
      {
        name:"Peserta",
        value: peserta
      },
      { 
        name:"Peraturan",
        value: soal.rules
      },  
      {
        name:"Score Distribution",
        value: soal.score
      }, 
      {
        name:"Problem Setters",
        value: soal.problemsetter
      },
      {
        name:'\u200b',
        value: 'Ayo gambling untuk tim favorit kalian!\n' + soal.scoreboard
      }
      ],
      timestamp: new Date(),
      footer: {
        icon_url: 'attachment://viericorp.png',
        text: "Powered By Vieri Corp.™ All Rights Reserved."
      }
    }
    });
  }
}