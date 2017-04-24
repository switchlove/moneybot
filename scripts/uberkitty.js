// skeleton.js
// Created by @currentsea#1256 for the moneybot project 
// Use this as a skeleton to get started writing a script 

var initialbet = 1; 
var maxbet = 100; 
var currentbet = initialbet; 
var cashoutmultiplier = 120; 
var gamecount = 0; 
var losscount = 0; 
var wincount = 0; 
var skipcount = 0; 
var skipratio = 0.02; // 0.05 means skip 5 percent of all games 
var skippct = skipratio * 100; 
var pcthitshit = Math.floor((Math.random() * 100) + 1); 		// Do not touch
var startingbalance = engine.getBalance(); 
var currentbalance = startingbalance; 

console.log('Starting Balance: ' + startingbalance); 
console.log('We will skip approximately ' + skippct + '% of all games'); 	
console.log('We will skip approximately ' + skippct + '% of all games'); 

console.log(' ____________________          ');
console.log('< DONT FUCK ME RYAN >          '); 
console.log(' --------------------          '); 
console.log('\                    _        '); 
console.log('       \            (_)       '); 
console.log('        \^__^       / \\       '); 
console.log('         (oo)\_____/_\ \       '); 
console.log('         (__)\       ) /       '); 
console.log('           ||----w   ((		'); 
console.log('           ||        ||>>      '); 

engine.on('game_starting', place_bet); 
engine.on('game_started', play_game); 
engine.on('cashed_out', cash_out); 
engine.on('game_crash', finish_game); 


function place_bet(gamedata) { 
	var gameid = gamedata['game_id']; 
	console.log('Game #' + gameid); 
	pcthitshit = Math.floor((Math.random() * 100) + 1); 
	console.log(pcthitshit);
	if (pcthitshit < skippct) { 
		skipcount++; 
		console.log('Skip game -- Current Skip Count: ' + skipcount); 
	} else { 
		console.log('Playing Game -- current balance: ' + currentbalance + 'bits'); 
		console.log(' ____________________          ');
		console.log('< DONT FUCK ME RYAN >          '); 
		console.log(' --------------------          '); 
		console.log('                    _          '); 
		console.log('       \            (_)        '); 
		console.log('        \^__^       / \\       '); 
		console.log('         (oo)\_____/_\\ \\     '); 
		console.log('         (__)\       ) /       '); 
		console.log('           ||----w  ((		    '); 
		console.log('           ||       ||>>       '); 
		console.log('Betting ' + currentbet + 'bits for a cashout multiplier of ' + cashoutmultiplier / 100.0 + 'x'); 
		engine.placeBet(formatamount(currentbet), cashoutmultiplier, false); 

	}
} 

function play_game(gamedata) { 

} 

function cash_out(gamedata) { 

} 

function finish_game(gamedata) { 
	console.log('Game Finished'); 
	var prevbal = currentbalance; 
	currentbalance = engine.getBalance() / 100; 
	// console.log('')
	var baldiffs = currentbalance - prevbal; 

	if (baldiffs >= 0) { 
		console.log('We gained a total of ' + baldiffs + ' bits on that game.'); 
	} else { 
		console.log('We lost a total of ' + baldiffs + ' bits on that game.'); 
	}
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
