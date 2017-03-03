// MoneyBot 3.0 - moneybot3.js
// Authors: Joe 'currentsea' Bull & Martin Markowski 
// https://github.com/currentsea/moneybot 

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

/** VARIABLE DECLARATIONS */ 
var startingbet = 1; // put your starting bet here
var bet = startingbet; 
var increasebet = 1.065; // how much to increase your bet by each round 
var takeprofit = 1899; // where to take profit (1899 = 18.99 in BaB)


var entrycriteria = 1866; // the entry criteria 
var maxlosers = 0; // max losers (set to 0 to play forever) 
var maxwinners = 0; // max winners (set to 0 to play forever)

engine.on('game_starting', start_game); 
engine.on('game_finished', finish_game); 

function start_game(gamedata) { 
	console.log('game is starting - placing bet ' + bet + ' with multiplier ' + takeprofit); 
	engine.placeBet(formatbet(startingbet), takeprofit, false);
}


function formatbet(betamount) { 
    return Math.round(betamount).toFixed(0)*100; 
}



