module.exports = {
  printScore: function(name, message){
    var hasil = '';
    var ac = message.guild.emojis.cache.find(emoji => emoji.name === "AC");
    var tle = message.guild.emojis.cache.find(emoji => emoji.name === "TLE");
    var wa = message.guild.emojis.cache.find(emoji => emoji.name === "WA");
    var rte = message.guild.emojis.cache.find(emoji => emoji.name === "RE");
    switch (`${name.a}`){
        case 'AC':
        hasil += `**A**: ${ac}\n`;
        break;
        case 'WA':
        hasil += `**A**: ${wa}\n`;
        break;
        case 'TLE':
        hasil += `**A**: ${tle}\n`;
        break;
        case 'RTE':
        hasil += `**A**: ${rte}\n`;
        break;
        default:
        hasil += '**A**: unatempted\n';
        break;
    }
    switch (`${name.b}`){
        case 'AC':
        hasil += `**B**: ${ac}\n`;
        break;
        case 'WA':
        hasil += `**B**: ${wa}\n`;
        break;
        case 'TLE':
        hasil += `**B**: ${tle}\n`;
        break;
        case 'RTE':
        hasil += `**B**: ${rte}\n`;
        break;
        default:
        hasil += '**B**: unatempted\n';
        break;
    }
    switch (`${name.c}`){
        case 'AC':
        hasil += `**C**: ${ac}\n`;
        break;
        case 'WA':
        hasil += `**C**: ${wa}\n`;
        break;
        case 'TLE':
        hasil += `**C**: ${tle}\n`;
        break;
        case 'RTE':
        hasil += `**C**: ${rte}\n`;
        break;
        default:
        hasil += '**C**: unatempted\n';
        break;
    }
    switch (`${name.d}`){
        case 'AC':
        hasil += `**D**: ${ac}\n`;
        break;
        case 'WA':
        hasil += `**D**: ${wa}\n`;
        break;
        case 'TLE':
        hasil += `**D**: ${tle}\n`;
        break;
        case 'RTE':
        hasil += `**D**: ${rte}\n`;
        break;
        default:
        hasil += '**D**: unatempted\n';
        break;
    }
    switch (`${name.e}`){
        case 'AC':
        hasil += `**E**: ${ac}\n`;
        break;
        case 'WA':
        hasil += `**E**: ${wa}\n`;
        break;
        case 'TLE':
        hasil += `**E**: ${tle}\n`;
        break;
        case 'RTE':
        hasil += `**E**: ${rte}\n`;
        break;
        default:
        hasil += '**E**: unatempted\n';
        break;
    }
    switch (`${name.f}`){
        case 'AC':
        hasil += `**F**: ${ac}\n`;
        break;
        case 'WA':
        hasil += `**F**: ${wa}\n`;
        break;
        case 'TLE':
        hasil += `**F**: ${tle}\n`;
        break;
        case 'RTE':
        hasil += `**F**: ${rte}\n`;
        break;
        default:
        hasil += '**F**: unatempted\n';
        break;
    }
    switch (`${name.g}`){
        case 'AC':
        hasil += `**G**: ${ac}\n`;
        break;
        case 'WA':
        hasil += `**G**: ${wa}\n`;
        break;
        case 'TLE':
        hasil += `**G**: ${tle}\n`;
        break;
        case 'RTE':
        hasil += `**G**: ${rte}\n`;
        break;
        default:
        hasil += '**G**: unatempted\n';
        break;
    }
    switch (`${name.h}`){
        case 'AC':
        hasil += `**H**: ${ac}\n`;
        break;
        case 'WA':
        hasil += `**H**: ${wa}\n`;
        break;
        case 'TLE':
        hasil += `**H**: ${tle}\n`;
        break;
        case 'RTE':
        hasil += `**H**: ${rte}\n`;
        break;
        default:
        hasil += '**H**: unatempted\n';
        break;
    }
    hasil += `**TOTAL**: ${name.total}\n`;
    // hasil += '----------------------------------------\n';
    // bot.channels.cache.get(channel.id).send(hasil);
    // console.log(`Name: ${name._cn6ca}`);
    return hasil;
  }
};