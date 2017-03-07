

/* USER CONFIGURATION SECTION */ 

/* BE VERY CAREFUL WHEN CONFIGURING THESE VALUES */ 

var initial_bet = 1; // This is what your initial bet will be in bits 
 /* The bet multiplier is represented as a 3 digit number,                  * 
  *  where the actual multiplier is equal to the value of                   * 
  *  betmultiplier / 100.0 as a type double (i.e. 200 = 2.0x multiplier).   * 
  *  																		*/
var bet_multiplier = 200; // READ THE COMMENT ABOVE - 200 is representative of 2.0 in bustabit




engine.on('game_starting', place_bets); 
engine.on('game_started', play_game); 

function place_bets(game_data) { 
	console.log('game is starting'); 
	console.log('placing bet of ' + initial_bet); 
	print_multiplier(bet_multiplier); 
	engine.placeBet(format_bet(initial_bet), bet_multiplier, false);  
} 

function play_game(game_data) { 
	console.log('we are playing the game'); 
} 

function format_bet(bet_amount) { 
    return Math.round(bet_amount).toFixed(0)*100; 
}

// Prints out what the multiplier will be for the given round in decimal form 
function print_multiplier() { 
	var float_bet_multiplier = parseFloat(bet_multiplier / 100.0); 
	console.log("The multiplier for this round is " + float_bet_multiplier); 
} 