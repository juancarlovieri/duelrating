module.exports = {
  cek: function(message){
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
}