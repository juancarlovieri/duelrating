const Discord = require('discord.js');
const request = require('request');
const Axios = require('axios');
const axios = require('axios');
const fs = require('fs');
const https = require('https');
var plotly = require('plotly')('juancarlovieri', "cFGB4qzuLQc1dTw67Z19");

function download(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
}

module.exports = {
  
  contest: function(){
    Axios.get(`https://kenkoooo.com/atcoder/resources/contests.json`)
   .then((response) => {
        FileDownload(response.data, 'atcoderContests.json');
   });
    // download('https://kenkoooo.com/atcoder/resources/contests.json', 'atcoderContest.json', function(){
    //   var contests = fs.readFileSync('atcoderContest.json', 'utf8');
    //   console.log(contests);
    // });
    // var data="";
    // var request = https.get('https://kenkoooo.com/atcoder/resources/contests.json', function(response) {
    //   // console.log(response);
    //   response.on("data",append=>data+=append).on("finish",()=>console.log('tes'));
    // });
  }
}