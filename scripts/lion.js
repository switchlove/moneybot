// kittyhunter.js

/* BEGIN LICENSE */ 
// Copyright (c) 2017 Joseph 'currentsea' Bull

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
/* END LICENSE */ 

// FOR THE LATEST VERSION OF THIS SCRIPT, VISIT https://github.com/currentsea/moneybot/releases
// ==> SEND DONATIONS TO SUPPORT FUTURE DEVELOPMENT: 1AVoq4UTbJS42cUq85WN7yRQHoxHtxKA7m

/* GLOBAL VARIABLES */ 
var username = ''; 
var initialmultiplier = 10000; 
var initialbalance = 0; 
var initialbet = 33; 
var betincrease = 1.0002; 
var currentbet = initialbet; 
var multipier = 100; 
var targetbonus = 0; 
var liveplay = true; 
var playeroverridecount = 0; 
var playeroverride = false; 
var gamecount = 0; 
var game_records = {}; 
var player_record = {}; 
var curgameid = 0; 
var current_game_guid = guid(); 
var gameslost = 0; 
var wincount = 0; 
var maxwins = 150; 
var lastresult = 'NOT_PLAYED'; 
var bonusgameswon = 0; 
console.log('---| Initial Game GUID: ' + current_game_guid);  

initialize(); 
engine.on('game_starting', place_bet); 
engine.on('game_started', play_game); 
engine.on('cashed_out', cash_out); 
engine.on('game_crash', finish_game); 

/* FUNCTIONS */ 
function initialize() { 
	console.log("---| Eagle33 is initializing"); 
	username = engine.getUsername(); 
	initialbalance = engine.getBalance() / 100; 
	console.log("---| Username: " + username); 
	console.log("---| Initial Balance: " + formatamount(initialbalance) + " bits"); 
	multiplier = initialmultiplier; 
} 

function place_bet(game_data) { 
	console.log('-----------------------------------------------------------------------------------------'); 
	console.log(JSON.stringify(game_data)); 
	curgameid = game_data.game_id; 
	console.log('---| Starting Game #' + curgameid + ' (Internal Reference ID: ' + current_game_guid + ")"); 
	game_records[current_game_guid] = {}; 
	game_records[current_game_guid]['pre_game_data'] = game_data; 
	game_records[current_game_guid]['live_game_data'] = {}; 
	game_records[current_game_guid]['live_game_data']['cashouts'] = []; 
	game_records[current_game_guid]['post_game_data'] = {}; 
	var formattedmultiplier = multiplier / 100.0; 
	var targetprofit = formattedmultiplier * currentbet; 
	var numplayersingame = game_data.length; 
	// console.log(numplayersingame + ' players are in this game'); 
	if (liveplay == true) { 
		console.log("---| Placing Bet: " + currentbet + "bits with a cashout multiplier of " + formattedmultiplier + "x (Target Profit: " + targetprofit + "bits)"); 
		engine.placeBet(formatamount(currentbet), multiplier, false);  
	} else { 
		// console.log('---| Placing Paper Bet: ' + currentbet + ' bits with a cashout multiplier of ' + formattedmultiplier); 
	}
} 

function cash_out(game_data) { 

	game_records[current_game_guid]['live_game_data']['cashouts'].push(game_data); 

	if (game_data.stopped_at > 7500 && gamecount % 5 == 0) { 
		engine.cashOut(cocallback); 
		engine.cashOut("Cashed out above 75x"); 
	} 


	if (game_data.stopped_at > 800 && gamecount % 3 == 0) { 
		engine.cashOut(cocallback); 
		console.log("Cashed out above 8x"); 
	} 


	if (game_data.stopped_at > 200 && gamecount % 5 == 0) { 
		var randomten = Math.floor((Math.random() * 10) + 1); // do not touch
		if (randomten % 2 == 0) { 
			engine.cashOut(cocallback); 
			console.log("Cashed out above 8x"); 
		} 
	} 



	if (game_data.stopped_at > 444 && gamecount % 7 == 0) { 
		var randomten = Math.floor((Math.random() * 10) + 1); // do not touch
		if (randomten % 2 == 0) { 
			engine.cashOut(cocallback); 
			console.log("Cashed out above 8x"); 
		} 
	} 



	// if (game_data.stopped_at > 500 && gamecount % 7 == 0) { 
	// 	engine.cashOut(cocallback); 
	// 	console.log("Cashed out above 5x"); 
	// } 

	// if (game_data.stopped_at > 200 && gamecount % 10 == 0) { 
	// 	engine.cashOut(cocallback); 
	// 	console.log("Cashed out above 2x"); 
	// } 

	// if (game_data.stopped_at > 314 && gamecount % 2 == 1) { 
	// 	engine.cashOut(cocallback); 
	// 	console.log("Cashed out above 3.14x"); 
	// } 


	if (game_data.stopped_at > 1000 && gamecount % 2 == 0) { 
		var randomten = Math.floor((Math.random() * 10) + 1); // do not touch
		if (randomten % 2 == 0) { 

			engine.cashOut(cocallback); 
			console.log("Cashed out above 10x"); 
		}
	} 


	// if (game_data.stopped_at > 176 && gamecount % 18 == 0) { 
	// 	engine.cashOut(cocallback); 
	// 	console.log("Cashed out above 1.76x"); 
	// } 


	if (game_data.username == engine.getUsername() && game_data.stopped_at < multiplier) { 
		var ourbet = game_records[current_game_guid]['live_game_data']['initial_bets'][engine.getUsername()]['bet'] / 100; 
		console.log("---| Player override cashout detected: " + ourbet + 'bits @' + game_data.stopped_at / 100.0 + 'x'); 
		playeroverride = true; 
		playeroverridecount++; 
	} 
} 

function cocallback(data) { 
	console.log("Cash out!"); 
} 

function play_game(game_data) { 
	console.log('---| Live Play Data - '); 
	// console.log(JSON.stringify(game_data)); 
	var playerbet = game_data[engine.getUsername()]['bet'] / 100; 
	var targetbonus = game_data[engine.getUsername()]['bonus'] / 100;

	if (playerbet != currentbet) { 
		currentbet = playerbet; 
		playeroverridecount++; 
		// console.log('---| Player override detected - bet of ' + playerbet + ' bits (target bonus: ' + targetbonus + ' bits)'); 
	}
	// console.log('MY TARGET BONUS IS: ' + targetbonus + ' bits');
	// console.log(JSON.stringify(targetbonus));   
	game_records[current_game_guid]['live_game_data']['initial_bets'] = game_data; 
}

function finish_game(game_data) { 
	gamecount++; 
	var gamecrash = game_data.game_crash; 
	var mybonus = game_data['bonuses'][engine.getUsername()] / 100; 

	if (mybonus != undefined && mybonus != NaN) { 
		console.log('---| My Bonus: ' + mybonus + 'bits'); 
		bonusgameswon++; 
	} else { 
		console.log('---| My Bonus: 0bits'); 
	} 

	gamecrash = gamecrash / 100.0; 
	console.log('---| Game #' + curgameid + ' (' + current_game_guid + ') is over. (Game Count: ' + gamecount
		 + ")"); 
	console.log('---| Game Crash: '  + gamecrash + 'x'); 
	console.log(JSON.stringify(game_data)); 
	game_records[current_game_guid]['post_game_data'] = game_data; 
	var playresult = engine.lastGamePlay(); 
	if (playresult == 'NOT_PLAYED') { 
		console.log('Didnt play'); 
	} else if (playresult == ('WON')) { 
		if (playeroverride == true) { 
			console.log("---| A human manually intervened and we won the game.  Not stopping the script and continuing to increase the bet"); 
			currentbet = currentbet + betincrease; 
		} else { 
			wincount = wincount + 1 

			if (wincount == maxwins) { 
				console.log("WE SNIPED THE KITTY.  TIME TO BAG IT AND TAG IT."); 
				console.log("STOPPING $CRIPT"); 
				console.log("FINAL GAME RECORDS SHOWN BELOW"); 
				console.log(JSON.stringify(game_records)); 
				console.log(JSON.stringify(player_record));
				engine.stop(); 
			}
		} 
	} else { 
		console.log("We lost."); 
		gameslost++; 
		currentbet = currentbet + betincrease; 
		multiplier = multiplier + 200; 
	}

	if (gameslost % 100 == 0 && gameslost != 0) { 
		console.log('Another 100 games of loss detected - resetting teh sniper'); 
		console.log(JSON.stringify(game_records)); 
		console.log(JSON.stringify(player_record)); 
		console.log("NUMBER OF PLAYER OVERRIDES: " + playeroverridecount); 
		currentbet = initialbet + (gameslost / 100.0); 
		initialbet += (gameslost / 100.0); 
		multiplier = initialmultiplier; 
	} 
	current_game_guid = guid(); 
	playeroverride = false; 
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