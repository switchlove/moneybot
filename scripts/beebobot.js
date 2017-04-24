// skeleton.js
// Created by @currentsea#1256 for the moneybot project 
// Use this as a skeleton to get started writing a script 

// sleep(1000); 
// engine.chat('[BeeboBot]: Our initial bankroll is ' + engine.getBalance() / 100 + 'bits. '); 
// sleep(1000); 
// engine.chat('[BeeboBot]: We are gonna chase the kitty with your help.  When a game goes between 50-100x, we will poll the channel for suggestions.  Either type \"CASHOUT BeeboBot\" or \"KEEP CHASING BeeboBot\" to allow us to determine what to do for the given high multiplier round.'); 
// sleep(1000); 
// engine.chat('[BeeboBot]: If the CASHOUT option is suggested more than the KEEP CHASING option, we will attempt to close as soon as possible once the game goes past 100x. If we are successful, 10% of the winnings will be split amongst those who helped make the proper suggestion.');  
var username = ''; 
var tpi = 100000; 
var gameswon = 0; 
var maxgames = 0; 
var gameslost = 0; 
var bitswon = 0; 
var bitslost = 0; 
var betincrease = 1.0003; 
var initialbalance = engine.getBalance() / 100; 
var initialbet = 1; 
var curbet = initialbet; 
var verbose = true; // with verbosity in logs 
var testing = true; // test or not 
var minconsiderationpayoutmultiplier = 20.0; 
var maxconsiderationpayoutmultiplier = 75.0; 
var cashoutvotes = 0; 
var keepchasingvotes = 0; 
var finalvotetallyposted = false; 
var finalvoteresultposted = false; 
var randomten = Math.floor((Math.random() * 10) + 1); 	
var mode = 'INITIALIZING'; 
var curroundcashoutvoters = []; 
var curroundkeepchasingvoters = []; 
var preroundbalance = initialbalance; 
var gamerecoveryinterval = 100; 

if (testing == true) { 
	engine.chat('[BeeboBot]: {{PLACE VOTES BETWEEN ' + minconsiderationpayoutmultiplier + 'x AND ' + maxconsiderationpayoutmultiplier +  'x}} ~~ BeeboBot has come online - initial balance: ' + engine.getBalance() / 100 + ' refid: ' + guid() + ' (For bot instructions, go here: https://pastebin.com/raw/BFSyQ4kn'); 
} 

engine.on('disconnected', script_disconnected); 
engine.on('game_starting', place_bet); 
engine.on('game_started', play_game); 
engine.on('cashed_out', cash_out); 
engine.on('game_crash', finish_game); 
engine.on('msg', process_chat_message); 

function process_chat_message(gamedata) { 

	if (gamedata.message == '!bb TERMINATE' && gamedata.username == 'beebo') { 
		engine.chat('OUR MASTER TOLD US TO STOP. THEREFORE, WE WILL STOP IMMEDIATELY. SHUT IT DOWN. SHUT IT ALL DOWN.'); 
		engine.stop(); 
	} 
	if (gamedata.message == 'BeeboBot stats' || gamedata.message == '!bb stats') { 

		engine.chat('Games Won: ' + gameswon + ' | Games Lost: ' + gameslost + ' | Net Profit/Loss for Run: ' + Math.round((bitslost * -1) + bitswon) + 'bits'); 
		// engine.chat('Games Won: ' + gameswon + '[Bits Won: ' + bitswon + '] | ' + 'Games Lost: ' + gameslost + ' [Bits Lost: ' + bitslost + '] | Net Profit Since Bot Initialization: ' + initialbalance - (bitslost + bitswon)); 
	} 
	if (engine.getCurrentPayout() > minconsiderationpayoutmultiplier && engine.getCurrentPayout() <= maxconsiderationpayoutmultiplier) { 
		if (gamedata.message == 'CASHOUT BeeboBot' || gamedata.message == '!bb CASHOUT' && gamedata.bot == false) { 
			engine.chat('CASHOUT Vote recorded - ' + gamedata.username); 
			cashoutvotes++; 
			curroundcashoutvoters.push(gamedata.username); 
		} else if (gamedata.message == 'KEEP CHASING BeeboBot' || gamedata.message == '!bb KEEP CHASING' && gamedata.bot == false) { 
			engine.chat('KEEP CHASING Vote recorded - ' + gamedata.username); 
			keepchasingvotes++; 
			curroundkeepchasingvoters.push(gamedata.username); 
		} 
	} 
	console.log('-----'); 
	console.log(' MESSAGE SHOWN BELOW'); 
	console.log(JSON.stringify(gamedata)); 
	console.log('-----'); 
}

function script_disconnected(gamedata) { 
	if (testing == true) { 
		engine.chat('[BeeboBot - TEST MODE] has gone offline'); 
	} else { 
		engine.chat('[BeeboBot] - BeeboBot has stopped.'); 
	}
} 

function place_bet(gamedata) { 
	preroundbalance = engine.getBalance() / 100; 
    engine.placeBet(formatbet(curbet), tpi, false); 

} 

function cocallback(gamedata) { 
   	engine.chat('We cashed out successfully [unless i wrote shitty code]!'); 
} 

function play_game(gamedata) { 
	var playing = true; 
	// while (playing) { 
	// 	sleep(1000); 
	// 	if (engine.getCurrentPayout() > minconsiderationpayoutmultiplier && engine.getCurrentPayout() <= maxconsiderationpayoutmultiplier) { 
	// 		playing = false; 
	// 		engine.chat('Final vote tally: CASHOUT_EARLY: ' + cashoutvotes + ' | ' + ' KEEP_CHASING: ' + keepchasingvotes); 
	// 		if (cashoutvotes > keepchasingvotes) { 
	// 			engine.chat('We will cash out early for this round.'); 
	// 			engine.cashOut(true); 
	// 		} 
	// 	} 
	// } 
} 

function cash_out(gamedata) { 
	var curpayout = engine.getCurrentPayout(); 
	if (finalvotetallyposted == false && engine.getCurrentPayout() > maxconsiderationpayoutmultiplier) { 
		engine.chat('Final vote tally: CASHOUT_EARLY: ' + cashoutvotes + ' | ' + ' KEEP_CHASING: ' + keepchasingvotes); 
		finalvotetallyposted = true; 
	} 
	if (engine.getCurrentPayout() >= maxconsiderationpayoutmultiplier) { 
		playing = false; 
			
		if (cashoutvotes > keepchasingvotes && finalvoteresultposted == false) { 
			engine.chat('We will cash out early for this round.'); 
			engine.cashOut(cocallback); 
			finalvoteresultposted = true; 
			mode = 'CASHOUT_EARLY'; 
		} else if (keepchasingvotes > cashoutvotes && finalvoteresultposted == false) { 
			engine.chat('We will keep chasing.'); 
			mode = 'KEEP_CHASING'; 
			finalvoteresultposted = true; 
		} else if (keepchasingvotes == cashoutvotes && finalvoteresultposted == false && engine.getCurrentPayout() >= maxconsiderationpayoutmultiplier) { 
			engine.chat('We had a tie in the votes cast.  We will pick a random number to decide our next outcome.'); 
			randomten = Math.floor((Math.random() * 10) + 1); 	
			if (randomten % 2 == 0) { 
				engine.chat('The random number suggested cashout early.  Acknowledging.'); 
				mode = 'CASHOUT_EARLY'; 
				engine.cashOut(cocallback); 
			} else { 
				engine.chat('The random number suggested to continue chase.  Acknowledging.'); 
				mode = 'KEEP_CHASING'; 
			} 
			finalvoteresultposted = true;
		} 
	} 
} 

function finish_game(gamedata) { 



	console.log(JSON.stringify(gamedata)); 
	var postroundbalance = engine.getBalance() / 100; 
	var roundbaldiff = postroundbalance - preroundbalance; 
	var lastcrash = gamedata.game_crash; 
	if (mode == 'CASHOUT_EARLY' && lastcrash < tpi && engine.lastGamePlay() == 'WON') { 
		engine.chat('The players who voted for CASHOUT_EARLY made a successful call and will be considered for the next round of rewards. Players: ' + JSON.stringify(curroundcashoutvoters)); 
	} else if (mode == 'CASHOUT_EARLY' && lastcrash >= tpi && engine.lastGamePlay() == 'WON') { 
		engine.chat('The audience voted for cashout early, but the nyan hit.  No consideration given to any votes made for this round.'); 
	} else if (mode == 'KEEP_CHASING' && lastcrash < tpi && engine.lastGamePlay() == 'LOST') { 
		engine.chat('The audience told us to keep chasing, but it busted.  Fucking lame.'); 
	} else if (mode == 'KEEP_CHASING' && lastcrash >= tpi && engine.lastGamePlay() == 'WON') { 
		engine.chat('The audience suggested to continue chasing, and they were correct.  We are terminating the execution of this round.  Final reference guid: ' + guid() + '. Players included in reward pool for nyan hit: ' + JSON.stringify(curroundkeepchasingvoters)); 
		engine.stop(); 
	} 

	if (engine.lastGamePlay() == 'WON') { 
		gameswon++; 
		bitswon += roundbaldiff; 

	} else if (engine.lastGamePlay() == 'LOST') { 
		gameslost++; 
		bitslost += roundbaldiff; 
	} 


	finalvotetallyposted = false; 
	finalvoteresultposted = false; 
	cashoutvotes = 0; 
	keepchasingvotes = 0; 

	curroundkeepchasingvoters = []; 
	curroundcashoutvoters = []; 
	mode = 'INITIALIZING'; 
	if (gameslost % gamerecoveryinterval == 0 && gameslost != 0) { 
		// console.log('Another 100 games of loss detected - resetting teh sniper'); 
		// console.log(JSON.stringify(game_records)); 
		// console.log(JSON.stringify(player_record)); 
		// console.log("NUMBER OF PLAYER OVERRIDES: " + playeroverridecount); 
		curbet = initialbet + gameslost / (gamerecoveryinterval * 1.0); 
		initialbet += (gameslost / (gamerecoveryinterval * 1.0)); 
		console.log("Total losses after 100 rounds: " + currentroundlosses); 
		// if (lossrecovery == false && recoveryfipped == false) { 

		// 	lossrecovery = true; 
		// }
		// 	lostrecoverybet = formatamount(losses); 
		// } 
	} else if (engine.lastGamePlay() != 'NOT_PLAYED') { 
		curbet = curbet + betincrease; 
		gamesplayed++; 
	}

	if (gamesplayed >= maxgames) { 
		engine.chat('Final game played - #' + gamesplayed + ' have successfully elapsed. Terminating.'); 
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

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function formatbet(betamount) { 
    return Math.round(betamount).toFixed(0)*100; 
}


