// skeleton.js
// Created by @currentsea#1256 for the moneybot project 
// Use this as a skeleton to get started writing a script 

engine.on('game_starting', place_bet); 
engine.on('game_started', play_game); 
engine.on('cashed_out', cash_out); 
engine.on('game_crash', finish_game); 


function place_bet(gamedata) { 

} 

function play_game(gamedata) { 

} 

function cash_out(gamedata) { 

} 

function finish_game(gamedata) { 

}

function guid() {
  return uid4() + uid4() + '-' + uid4() + '-' + uid4() + '-' + uid4() + '-' + uid4() + uid4() + uid4();
}

function uid4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}
function formatamount(amount) { 
    return Math.round(amount).toFixed(0)*100; 
}
