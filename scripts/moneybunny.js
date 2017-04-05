
// skeleton.js
// Created by @currentsea#1256 for the moneybot project 
// Use this as a skeleton to get started writing a script 
var startingbet = 50; 		 /* Starting bet goes here */ 
var currentbet = startingbet; 
var myusername = engine.getUsername(); 
var cashoutmultiplier = 125; /* 1.25x is represented as 125 in the scripting engine */
var recoverbet = 250; 		 /* Use a fixed recovery bet amount */ 
var conseclosslimit = 2; 
var wincount = 0; 
var losscount = 0; 
var gamecount = 0; 
var biglosses = 0; // losses on the recovery bet count 
var littlelosses = 0; // losses on the little bet count 


console.log('---- MONEY BUNNY ACTIVATE ---'); 
console.log('--| Username: ' + myusername); 
engine.on('game_starting', place_bet); 
engine.on('game_started', play_game); 
engine.on('cashed_out', cash_out); 
engine.on('game_crash', finish_game); 


function place_bet(gamedata) { 
	gamecount++; 
	console.log('Starting game #' + gamecount); 
	console.log('Placing a bet of ' + currentbet + 'bits with a cashout multiplier of ' + ); 
	engine.place_bet(formatamount(currentbet), cashoutmultiplier, false); 
} 

function play_game(gamedata) { 
	console.log('The game is being played...'); 
} 

function cash_out(gamedata) { 
	if (gamedata.username == myusername) { 
		console.log('We cashed out and won game #' + gamecount); 
	}	
} 

function finish_game(gamedata) { 
	gamecount++; 
	var crashformatted =  gamedata.game_crash / 100.0; 
	console.log('Game #' + gamecount + 'is over with a bust of ' + crashformatted + 'x'); 
    var gameresultstatus = engine.lastGamePlay(); 
    if (gameresultstatus == 'NOT_PLAYED') { 
    	console.log("We did not play the last game."); 
   	} else if (gameresultstatus == 'WON') { 
   		console.log('We won the last game!'); 
   	} else { 
   		console.log("We lost the game with our bet of " + currentbet + " bits.  Shit."); 
		if (currentbet == recoverbet) { 
			biglosses++; 
		} else { 
			currentbet = recoer
			littlelosses++; 
		} 

   	}
	
	if (currentbet == recoverbet) { 
		console.log("Resetting our recovery bet of " + recoverbet + "bits to our initial bet of" + initialbet + " bits");    			currentbet = initialbet; 
		currentbet = initialbet; 
		// if gameresult
	} 
}
