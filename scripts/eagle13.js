

/* USER CONFIGURATION SECTION */ 

/* BE VERY CAREFUL WHEN CONFIGURING THESE VALUES */ 

var initial_bet = 1; // This is what your initial bet will be in bits 
 /* The bet multiplier is represented as a 3 digit number,                  * 
  *  where the actual multiplier is equal to the value of                   * 
  *  betmultiplier / 100.0 as a type double (i.e. 200 = 2.0x multiplier).   * 
  *  																		*/
var bet_multiplier = 200; // READ THE COMMENT ABOVE - 200 is representative of 2.0 in bustabit

/** GAME STATE VARIABLES -- DO NOT MESS WITH THESE UNLESS YOU KNOW EXACTLY WHAT YOU ARE DOING **/
var game_count = 0; 

var game_records = {}; 



engine.on('game_starting', place_bets); 
engine.on('game_started', play_game); 
engine.on('game_crash', game_over); 

/** ENGINE FUNCTIONS **/ 

// This is called a few seconds before each game is about to start and is where you place your bet
// A sample of what gets passed to 'game_data' can be found at this gist shown in the URL below.
// Sample data gist: 
function place_bets(game_data) { 
	console.log('game is starting'); 
	console.log('placing bet of ' + initial_bet); 
	print_multiplier(bet_multiplier); 
	console.log(JSON.stringify(game_data)); 
	engine.placeBet(format_bet(initial_bet), bet_multiplier, false);  
} 

// This is called while we are playing the game, a example of what gets passed to 'game_data' can be
// found in this gist: https://gist.github.com/currentsea/9cb7d8dda9aa5a6e35aa339b913dcc97
function play_game(game_data) { 
	console.log('we are playing the game'); 
	// console.log(JSON.stringify(game_data)); 
} 

// This will be called at the end of every game or as soon as a given game "busts" 
// To view an example of what gets passed to the 'game_data' variable, you can reference 
// this gist: https://gist.github.com/currentsea/e21f975831fc49bfaa75f5762b1d1238
function game_over(game_data) { 
	console.log('game_over sampledata'); 
	// console.log(JSON.stringify(game_data)); 
}
/** END ENGINE FUNCTIONS **/ 


/** UTILITY FUNCTIONS **/
function format_bet(bet_amount) { 
    return Math.round(bet_amount).toFixed(0)*100; 
}

// Prints out what the multiplier will be for the given round in decimal form 
function print_multiplier() { 
	var float_bet_multiplier = parseFloat(bet_multiplier / 100.0); 
	console.log("The multiplier for this round is " + float_bet_multiplier); 
} 
/** END UTILITY FUNCTIONS **/ 