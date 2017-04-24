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
var tpi = 1000; 
var initialbalance = engine.getBalance() / 100; 
var initialbet = 1; 
var verbose = true; // with verbosity in logs 
var testing = true; // test or not 
var minconsiderationpayoutmultiplier = 1.5; 
var maxconsiderationpayoutmultiplier = 2.5; 
var cashoutvotes = 0; 
var keepchasingvotes = 0; 
var finalvotetallyposted = false; 
var finalvoteresultposted = false; 
var randomten = Math.floor((Math.random() * 10) + 1); 	

if (testing == true) { 
	engine.chat('[BeeboBot - TEST MODE - not actively accepting suggestions]: BeeboBot has come online - initial balance: ' + engine.getBalance() / 100 + ' refid: ' + guid() + ' (For bot instructions, go here: https://pastebin.com/raw/BFSyQ4kn'); 
} 

engine.on('disconnected', script_disconnected); 
engine.on('game_starting', place_bet); 
engine.on('game_started', play_game); 
engine.on('cashed_out', cash_out); 
engine.on('game_crash', finish_game); 
engine.on('msg', process_chat_message); 

function process_chat_message(gamedata) { 
	if (engine.getCurrentPayout() > minconsiderationpayoutmultiplier && engine.getCurrentPayout() <= maxconsiderationpayoutmultiplier) { 
		if (gamedata.message == 'CASHOUT BeeboBot') { 
			engine.chat('CASHOUT Vote recorded - ' + gamedata.username); 
			cashoutvotes++; 
		} else if (gamedata.message == 'KEEP CHASING BeeboBot') { 
			engine.chat('KEEP CHASING Vote recorded - ' + gamedata.username); 
			keepchasingvotes++; 
		} 
	} 
	console.log('-----'); 
	console.log(engine.getCurrentPayout() + ' MESSAGE SHOWN BELOW'); 
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
	if (engine.getCurrentPayout() > minconsiderationpayoutmultiplier && engine.getCurrentPayout() <= maxconsiderationpayoutmultiplier) { 
		playing = false; 
			
		if (cashoutvotes > keepchasingvotes && finalvoteresultposted == false) { 
			engine.chat('We will cash out early for this round.'); 
			engine.cashOut(true); 
			finalvoteresultposted = true; 
		} else if (keepchasingvotes > cashoutvotes && finalvoteresultposted == false) { 
			engine.chat('We will keep chasing.'); 
			finalvoteresultposted = true; 
		} else if (keepchasingvotes == cashoutvotes && finalvoteresultposted == false) { 
			engine.chat('We had a tie in the votes cast.  We will pick a random number to decide our next outcome.'); 
			randomten = Math.floor((Math.random() * 10) + 1); 	
			if (randomten % 2 == 0) { 
				engine.chat('The random number suggested cashout early.  Acknowledging.'); 
				engine.cashOut(cocallback); 
			} else { 
				engine.chat('The random number suggested to continue chase.  Acknowledging.'); 
			} 
			finalvoteresultposted = true;
		} 
	} 
	// if (curpayout > minconsiderationpayoutmultiplier && curpayout <= maxconsiderationpayoutmultiplier) { 

	// } 

	// console.log('CURRENT PAYOUT: ' + curpayout); 
 //    if (verbose == true) { 
 //        console.log('--------- CHAT MESSAGE BELOW -----------'); 
 //        console.log(JSON.stringify(gamedata)); 
 //        console.log('---------- END CHAT MESSAGE ------------');
 //    } 
 //    if (gamedata.message == 'CASHOUT BeeboBot') { 
 //        engine.chat('[BeeboBot]: Suggestion of CASHOUT EARLY recorded for user ' + gamedata.username + ' - suggestion confirmation guid: ' + guid()); 
 //    } else if (gamedata.message == 'KEEP CHASING BeeboBot') { 
	// 	engine.chat('')		
 //    } 
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

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}


