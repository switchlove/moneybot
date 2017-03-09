

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
var current_game_guid = ''; 
var player_record = {}; 
engine.on('game_starting', place_bets); 
engine.on('game_started', play_game); 
engine.on('game_crash', game_over); 

/** ENGINE FUNCTIONS **/ 

// This is called a few seconds before each game is about to start and is where you place your bet
// A sample of what gets passed to 'game_data' can be found at this gist shown in the URL below.
// Sample data gist: https://gist.github.com/currentsea/95f2fa56ef5375292f9d77f7513aaf5a
function place_bets(game_data) { 
	console.log('game is starting'); 
	print_multiplier(bet_multiplier); 
	console.log(JSON.stringify(game_data)); 
	game_count = game_count + 1; 
	var game_guid = guid(); 
	current_game_guid = game_guid; 
	game_records[game_guid] = {}; 
	game_records[game_guid]['pre_game_data']= game_data; 
	console.log('game id: #' + game_count + ' (UID: ' + game_guid + ')'); 
	console.log('placing bet: ' + initial_bet + ' (cashout @ ' + parseFloat((bet_multiplier / 100.0)) + ')'); 
	//engine.placeBet(format_bet(initial_bet), bet_multiplier, false);  
} 

// This is called while we are playing the game, a example of what gets passed to 'game_data' can be
// found in this gist: https://gist.github.com/currentsea/9cb7d8dda9aa5a6e35aa339b913dcc97
function play_game(game_data) { 
	console.log('we are playing the game'); 
	game_records[current_game_guid]['live_game_data'] = game_data; 
} 

// This will be called at the end of every game or as soon as a given game "busts" 
// To view an example of what gets passed to the 'game_data' variable, you can reference 
// this gist: https://gist.github.com/currentsea/e21f975831fc49bfaa75f5762b1d1238
function game_over(game_data) { 
	console.log(''); 
	game_records[current_game_guid]['post_game_data'] = game_data; 
	console.log('game #' + game_count + ' is over'); 
	calculate_game_strategy();
	calculate_biggest_winner(); 
} 
/** END ENGINE FUNCTIONS **/ 


/** UTILITY FUNCTIONS **/
function format_bet(bet_amount) { 
    return Math.round(bet_amount).toFixed(0)*100; 
}

function calculate_game_strategy() { 
	var game_history_record = game_records; 
	for (var thing in game_history_record) {
		var gamelosers = []; 
		var gamewinners = []; 
		console.log(); 
		console.log ('===> NEW GAME <==='); 
		console.log('--- PRE GAME DATA ---'); 
		console.log(thing); 
		console.log(JSON.stringify(game_history_record[thing]['pre_game_data'])); 
		console.log('--- LIVE GAME DATA ---'); 
		console.log(); 
		var biggestwinner = ''; 
		var biggestloser = ''; 
		var biggestloss = 0; 
		var biggestwin = 0; 	
		var lgd = game_history_record[thing]['live_game_data'];  
		for(var player in lgd) { 
			var playerstoppedat = lgd[player]['stopped_at']; 
			var playerbet = game_history_record[thing]['live_game_data'][player]['bet']; 
			var gamecrashedat = parseFloat(game_history_record[thing]['post_game_data']['game_crash'] / 100.0); 
			playerbet = playerbet / 100; 
			if (player_record[player] == undefined) { 
				// console.log('creating player record ' + player);
				player_record[player] = {}; 
				player_record[player]['cashout_crash_differences'] = []; 
				player_record[player]['cashout_points'] = []; 
				player_record[player]['profit_loss'] = 0;
				player_record[player]['total_wagered'] = 0; 
				player_record[player]['wincount'] = 0; 
				player_record[player]['losscount'] = 0; 

			} 
			player_record[player]['total_wagered'] += player_record[player]['total_wagered'] + playerbet; 
			if (playerstoppedat == undefined) { 
				player_record[player]['cashout_crash_differences'].push(0); 
				player_record[player]['cashout_points'].push(0); 
				// console.log(player + ' lost with a bet of ' + parseInt(JSON.stringify(playerbet) + ' bits')); 
				player['profit_loss'] = -1 * playerbet; 
				gamelosers.push(player); 
				if (biggestloser == '' || (playerbet * -1) < biggestloss) { 
					biggestloser = player; 
					biggestloss = playerbet * -1; 
				}
				player_record[player]['losscount'] = player_record[player]['losscount'] + 1;
				player_record[player]['total_profit_loss'] -= player_record[player]['total_profit_loss'] - playerbet; 
			} else { 
				var playerbonus = game_history_record[thing]['post_game_data']['bonuses'][player]; 
				var playerstoppedat = game_history_record[thing]['live_game_data'][player]['stopped_at'] / 100.0; 
				var playerwonwithoutbonus = playerbet * playerstoppedat; 
				var cumulativeplayerwinnings = playerwonwithoutbonus + playerbonus; 
				player_record[player]['total_profit_loss'] += cumulativeplayerwinnings; 
				// console.log(player + ' won the game with a bet of ' + playerbet + 'bits and cashed at ' + playerstoppedat + 'x and won a total of ' + Math.round(cumulativeplayerwinnings).toFixed(0) + ' bits with a ' + playerbonus + 'bits bonus.'); 
				gamewinners.push(player); 
				if (biggestwinner == '' || cumulativeplayerwinnings > biggestwin) { 
					biggestwinner = player; 
					biggestwin = cumulativeplayerwinnings; 
				} 
				player_record[player]['wincount'] = player_record[player]['wincount'] + 1;
				var test = player_record[player]['total_profit_loss']  + cumulativeplayerwinnings; 
				if (test == undefined) { 
					console.log('UNDEFINED -'); 

				} 
				player_record[player]['total_profit_loss'] += playerbet; 
				player_record[player]['cashout_points'].push(parseFloat(playerstoppedat)); 
				player_record[player]['cashout_crash_differences'].push(parseFloat(gamecrashedat - playerstoppedat)); 
			}
		}
		// console.log('BIGGEST WINNER OF THIS MATCH: ' + biggestwinner + ' (WIN OF ' + biggestwin + ' bits)'); 
		// console.log('BIGGEST LOSER OF THIS MATCH: ' + biggestloser + ' (WIN OF ' + biggestloss + ' bits)'); 

		// console.log(); 
		// console.log('--- POST GAME DATA ---'); 
		// console.log(); 	
		// console.log(JSON.stringify(game_history_record[thing]['post_game_data'])); 
		// console.log('===ENDGAME==='); 
		// console.log(JSON.stringify(player_record)); 

		// console.log(JSON.stringify(game_history_record[thing])); 
	}
} 

function calculate_biggest_winner() { 
	var biggestwincount = 0; 
	var biggestlosscount = 0; 
	var biggestwinner = ''; 
	var biggestloser = ''; 
	var biggestwinnerdict = {}; 
	var biggestloserdict = {}; 
	var maxpl = 0; 
	var biggestlosspl = 0; 
	var biggestlosingplayer = ''; 
	var biggestwinnercountplayer = ''; 
	var mostwagered = 0; 
	var mostwgeredplayer = ''; 

	for (var player in player_record) { 
		if (game_records[current_game_guid]['live_game_data'][player] != undefined) { 
			var playerwager = game_records[current_game_guid]['live_game_data'][player]['bet']; 
		}
		if (playerwager != undefined && playerwager != 0) { 
			// console.log('PLAYER WAGER FOR ' + player + ' was ' + playerwager); 
			player_record[player]['total_wagered'] += playerwager; 
			var playerwincount = player_record[player]['wincount']; 
			var playerlosscount = player_record[player]['losscount']; 
			var playerpl = player_record[player]['total_profit_loss']; 

			if (playerpl > maxpl) { 
				maxpl = playerpl;
				biggestwinner = player; 
			}

			if (playerpl < biggestlosspl) { 
				biggestlosspl = playerpl; 
				biggestlosingplayer = player; 
			} 
			var playertotalwager = player_record[player]['total_wagered'];

			if (playertotalwager > mostwagered) { 
				mostwagered = playertotalwager; 
				mostwageredplayer = player; 
			}

			// console.log(player + ' win count is ' + playerwincount + ' biggestwin count is ' + biggestwincount); 
			if (playerwincount > biggestwincount) { 
				biggestwincount = playerwincount; 
				biggestwinnerdict['winner'] = player; 
				biggestwinnerdict['count'] = playerwincount; 
				console.log(player + '(' + biggestwincount + ' wins)'); 
				biggestwinnercountplayer = player; 
			}	
			if (playerlosscount > biggestlosscount) { 
				biggestlosscount = playerlosscount; 
				biggestloserdict['loser'] = player; 
				biggestwinnerdict['count'] = playerlosscount; 
				biggestloser = player; 
			}	
		} 
		playerwager = 0; 
	} 
	console.log(biggestwinnerdict); 
	console.log('---'); 
	console.log('BIGGEST WINNER IS: ' + biggestwinner + ' WITH ' + maxpl + ' profit '); 
	console.log('BIGGEST LOSER IS: ' + biggestlosingplayer + ' WITH ' + biggestlosspl + ' profit'); 

	console.log('MOST WINS IS: ' + biggestwinnercountplayer + ' WITH ' + biggestwincount + ' wins'); 
	console.log('MOST LOSSES IS: ' + biggestloser + ' WITH ' + biggestlosscount + ' losses'); 
	console.log('---'); 
} 

// Prints out what the multiplier will be for the given round in decimal form 
function print_multiplier() { 
	var float_bet_multiplier = parseFloat(bet_multiplier / 100.0); 
	console.log("The multiplier for this round is " + float_bet_multiplier); 
} 

function guid() {
  return uid4() + uid4() + '-' + uid4() + '-' + uid4() + '-' + uid4() + '-' + uid4() + uid4() + uid4();
}

function uid4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}
/** END UTILITY FUNCTIONS **/ 