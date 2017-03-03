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
var username = 'beebo' 
var startingbet = 1; 
var betincrement = 1.065; 
var takeprofitpoint = 1899; 
var gamesplayedcount = 0; 
var takeprofitincrementinterval = 0.9999; 
var playgamecriteria = 1866; 
var gamewaitcount = 5; 
var martingalewaitcount = 0; 
var moneybot = 0; 
var medianupper = 1.96; 
var maxwinninggames = 33; 
var maxlosinggames = 33; 
var resetlosscountonwin = false; 
var winningstreakbetincrement = 1; 
var abortwhenmedianfails = 0; 
var abortonfailedentrycriteria = 0; 
var botpriority = 1;    
var bethistory = []; 
var gamehistory = [];  
var gameresults = []; 
var historicalmedian = 197; 
console.log('starting median: ' + historicalmedian); 
var currentbet = startingbet; 
var multiplier = takeprofitpoint;
var triggeredbusts = 0; 
var grosswinnings = 0; 
var grosslosses = 0; 
var numwinners = 0; 
var numlosers = 0; 
var numskipped = 0; 
var netprofits = 0; 
var totalprofit = 0; 
var losingsteak = 0; 
var paperbetting = 0; 
var moneybotlength = 0; 
var moneybotconfirmations = 0;
var gameselapsed = 0; 
var verbose = false; 
var state = 0; 
var cooldownelapsed = 0; 
var cooldowncount = 3; 
var winrate = 0;
var chatbet = false; 
var mimic = false; 
var startingbalance = engine.getBalance(); 
var currentbalance = startingbalance; 
var pregamebalance = currentbalance; 
var laststatus = engine.lastGamePlay(); 
var targetmimic = 'MountainDew'; 
var startgamerecords = []; 
var usersplaying = []; 
var falconexample = "FALCON mimic abc";
var mimicbet = 0; 
var falconregexp = /(?:^|\s)FALCON\s(.*?)\s(.*?)\s(.*)(?:\s|$)/g;
var gamemode = "NOT_SPECIFIED"; 
var martingalecount = 0; 
var martingalebet = startingbet; 
var martingaletpi = takeprofitpoint; 
var random_mimic = false; 
var xhr = new XMLHttpRequest();


/** BEGIN ENGINE INSTRUCTIONS */ 
engine.on('game_starting', start_game); 

engine.on('game_started', play_game); 

engine.on('game_crash', finish_game); 

engine.on('player_bet', process_player_bet); 

engine.on('cashed_out', cashout); 

engine.on('connected', script_connected); 

engine.on('disconnected', script_disconnected); 

engine.on('msg', process_chat_message); 
/** END ENGINE INSTRUCTIONS */ 


/** BEGIN ENGINE LOGIC */ 
function script_connected(gamedata) { 
    console.log('script connected'); 
    engine.chat("[MONEYFALCON] The money falcon has come online"); 
    console.log('game history shown below upon connection'); 
    console.log(JSON.stringify(gamehistory)); 
} 

function script_disconnected(gamedata) { 
    console.log('script disconnected, stopping all bets if one in progress...'); 
    engine.cashOut(cocallback);
    console.log('summarizing game history - JSON shown below'); 
    console.log(JSON.stringify(gamehistory)); 
    console.log('stopping script'); 
    engine.stop();  
}

function start_game(gamedata) { 
    log_pre_game_data(gamedata); 
    calculate_net_profits(); 
    console.log("game # " + gameselapsed + " is starting..."); 
    calculate_win_rate(); 
    summarize(); 
    pregamebalance = engine.getBalance(); 


    console.log('balance before game #' + gameselapsed + ': ' + pregamebalance); 
    if (gamemode == 'NOT_SPECIFIED') { 
        console.log('No game mode specified - not playing'); 
    } else if (gamemode == 'COOLDOWN') { 
        console.log('Cooldown mode enabled - not playing for 3 consecutive rounds (elapsed games: ' + cooldownelapsed + ' / ' + cooldowncount + ')')
        // cooldowncount++; 
    } else if (gamemode == 'MIMIC') { 
        console.log('game mode is MIMIC'); 
        console.log('mimic user is ' + targetmimic); 
        currentbet = mimicbet; 
        var themultiplier = 1900; 
        engine.placeBet(formatbet(currentbet), themultiplier, false); 
        mimic = false; 
        gamemode = "MARTINGALE"; 
        currentbet = startingbet; 
    } else if (gamemode == 'MARTINGALE') { 
        // var themultiplier = 1900; 
        if (martingalewaitcount >= gamewaitcount) { 
            console.log('starting martingale'); 
            martingaletpi = Math.round(martingaletpi).toFixed(0);         
            martingaletpi = parseInt("" + martingaletpi);        
            console.log('calling placebet ' + martingalebet + ' with take profit multiplier of ' + martingaletpi); 
            engine.placeBet(formatbet(martingalebet), martingaletpi, false); 
        } else { 
            console.log('Martingale criteria not met - skipping'); 
        }

    }

}

function formatbet(betamount) { 
    return Math.round(betamount).toFixed(0)*100; 
}

function cashout(gamedata) { 
    log_cashout_data(gamedata); 
    if (mimic == true && gamedata.username == targetmimic) { 
        engine.cashOut(true); 
        console.log('cashed out when ' + targetmimic + ' did'); 
    } 
} 

function play_game(gamedata) { 
    var randindex = Math.floor((Math.random() * 10) + 1); // do not touch
    var count = 0; 
    if (verbose == true) { 
        console.log('index ' + randindex); 
        console.log("we are now playing the game");
        console.log(JSON.stringify(gamedata));  
        console.log('game #' + gameselapsed); 
    } 

    startgamerecords.push(gamedata); 

    for (var currentuser in gamedata) { 
        usersplaying.push(currentuser.username); 
    } 
    var founduser = false; 
    var targetindex = Math.floor((Math.random() * gamedata.length) + 1);
    for (var curuser in gamedata) { 
        if (curuser.username == targetmimic) { 
            founduser = true; 
        }
    }

    if (founduser == false || random_mimic == true) { 
        var count = 0; 
        for (var curuser in gamedata) { 

            if (count > targetindex) { 
                targetmimic = curuser.username; 
                console.log('new target mimic: ' + targetmimic); 
            }
            count++; 
        }
    }
}

function process_player_bet(gamedata) { 
    if (verbose == true) { 
        console.log('player bet occurred'); 
        console.log(JSON.stringify(gamedata)); 
    } 
}

function process_chat_message(gamedata) { 
    if (verbose == true) { 
        console.log('--------- CHAT MESSAGE BELOW -----------'); 
        console.log(JSON.stringify(gamedata)); 
        console.log('---------- END CHAT MESSAGE ------------');
    } 
    if (gamedata.message == 'FALCON help') { 
        engine.chat('[FALCONBOT]: Learn more about falcon bot at https://github.com/currentsea/moneybot'); 
    }
    if (gamedata.username == username) { 
        var match = falconregexp.exec(gamedata.message);

        if (match != undefined) { 
            var falconcommand = match[1]; 
            if (falconcommand == 'mimic') { 
                var mimicuser = match[2]; 
                var amount = match[3]; 
                mimic = true; 
                targetmimic = mimicuser;
                gamemode = "MIMIC";  
                mimicbet = parseInt(amount);  
                if (targetmimic == 'random') { 
                    random_mimic = true; 
                    engine.chat('[FALCONBOT]: we will bet ' + mimicbet + ' bits and cash out the same time a randomly selected user does next round (or 19x, whatever comes first)...'); 
                } else { 
                    engine.chat('[FALCONBOT]: we will bet ' + mimicbet + ' bits and cash out the same time ' + mimicuser +' does next round (or 10x, whatever comes first)... [if ' + mimicuser + ' is not playing in the next round we will pick a user to follow at random]'); 
                }

            } 
        } else { 
            if (gamedata.message == 'FALCON stop') { 
                console.log('FALCON is stopping'); 
                engine.chat('[FALCONBOT]: FALCON BOT stopping'); 
                engine.stop(); 
            }

            if (gamedata.message == 'FALCON summary') { 
                engine.chat('Size of game history record: ' + gamehistory.length); 
                console.log(JSON.stringify(startgamerecords)); 
                console.log(JSON.stringify(gamehistory)); 
            }

            if (gamedata.message == 'FALCON status') { 
                console.log('FALCON is online'); 
                engine.chat('[FALCONBOT]: FALCON BOT is online +'); 
            }

            if (gamedata.message == 'FALCON mode') { 
                console.log('FALCON is online'); 
                engine.chat('[FALCONBOT]: FALCON is currently using ' + gamemode + ' mode'); 
            }

            if (gamedata.message == 'FALCON gamecount') { 
                console.log('FALCON is online'); 
                gamesplayedcount = numwinners + numlosers; 
                engine.chat('[FALCONBOT]: Games Played: ' + gamesplayedcount + ' | Games Elapsed: ' + gameselapsed + ' | Games Won: ' + numwinners + ' | Games Lost: ' + numlosers + " | Median: " + historicalmedian); 
            } 

            if (gamedata.message == 'FALCON martingale') { 
                console.log('Setting game mode to martingale');
                gamemode = "MARTINGALE"; 
                engine.chat('[FALCONBOT]: Martingale mode activated - wait criteria of ' + gamewaitcount + ' must be acquired before we begin playing.'); 
            }

            if (gamedata.message == 'FALCON martingale immediately') { 
                gamemode = 'MARTINGALE'; 
                martingalewaitcount = gamewaitcount; 
                engine.chat('[FALCONBOT]: We will begun attempting the martingale streak immediately (no wait streak required)'); 
            } 

            if (gamedata.message == 'FALCON cooldown 2') { 
                cooldowncount = 2; 
                gamemode = 'COOLDOWN'; 
                engine.chat('[FALCONBOT]: we will not play for ' + cooldowncount + ' consecutive rounds'); 
            }
        }
    }
} 
/** END ENGINE LOGIC */ 

/** HELPERS */ 
function median(values) {
    values.sort( function(a,b) {return a - b;} );
    var half = Math.floor(values.length/2);
    var themedian = 0; 
    if (values.length % 2 == 0) { 
        themedian = values[half];
    }
    else { 
        var numerator = (values[half-1] + values[half]); 
        themedian =  numerator / 2.0;
    }
    return themedian; 
}

function finish_game(gamedata) { 
    console.log("Game is finished"); 
    console.log(gamedata); 
    log_post_game_data(gamedata); 
}

function log_pre_game_data(gamedata) { 
    console.log('--------------------------------------------'); 
    console.log('Game is starting - JSON shown below'); 
    console.log(JSON.stringify(gamedata)); 
} 

function log_post_game_data(gamedata) { 
    console.log('--------------------------------------------'); 
    console.log('Game is finished - JSON shown below'); 
    // console.log(JSON.stringify(gamedata)); 
    gamehistory.push(gamedata); 
    // console.log(JSON.stringify(gamehistory)); ingale
    summarize_history(gamedata); 
    var gameresultstatus = engine.lastGamePlay(); 
    laststatus = gameresultstatus; 
    if (gameresultstatus == 'WON') { 
        numwinners++; 
        gamesplayedcount++; 
        var baldiff = (engine.getBalance() / 100) - pregamebalance; 
        grosswinnings += baldiff; 
    } else if (gameresultstatus == 'LOST') { 
        numlosers++; 
        gamesplayedcount++; 
        grosslosses += currentbet; 
    } else { 
        numskipped++; 
    } 

    if (gamemode == 'MIMIC') {
        if (laststatus == 'WON') { 
            // engine.chat('[FALCONBOT] We mimicked ' + targetmimic + ' successfully and won the game!'); 
            console.log('Resetting game to martingale'); 
            gamemode = 'MARTINGALE'; 
        } else if (laststatus == 'LOST') { 
            console.log('Resetting game to martingale'); 
            gamemode = 'MARTINGALE'; 
            // engine.chat('[FALCONBOT] We mimicked ' + targetmimic + ' and failed miserably'); 
        }
    } 

    if (gamemode == 'MARTINGALE') { 
        if (gamedata.game_crash < playgamecriteria) { 
            martingalecount = martingalecount + 1; 
            console.log('martingale count: ' + martingalecount + ' out of ' + gamewaitcount); 

        } else { 
            martingalecount = 0; 
            console.log('Martingale count reset to 0'); 
        }
        if (laststatus == 'WON') { 
           console.log('We won the martingale after ' + martingalecount + ' games.'); 
            martingalebet = startingbet; 
        } else if (laststatus == 'LOST') {
            console.log("we lost the martingale (turn number " + martingalecount + ')'); 
            martingalebet = martingalebet * betincrement; 
            martingaletpi = martingaletpi * takeprofitincrementinterval
            console.log('next game will use bet of ' + martingalebet + ' with a take profit multiplier of ' + martingaletpi); 
        }
    } 
    if (gamemode == 'COOLDOWN') {
        if (cooldownelapsed >= cooldowncount) { 
            console.log('Cooldown complete - martingale activated again.'); 
            gamemode = 'MARTINGALE'; 
            cooldownelapsed = 0; 
            cooldowncount = 3; 
        }
    }
    if (gamemode == 'COOLDOWN' && laststatus == 'NOT_PLAYED') {
        cooldownelapsed = cooldownelapsed + 1;  
    } else if (gamemode == 'COOLDOWN' && (laststatus == 'WON' || laststatus == 'LOST')){ 
        console.log("MANUAL PLAY DETECTED DURING COOLDOWN - Last game (" + laststatus + ") does not count toward required cooldown target of " + cooldowncount + ' games.')
    }
    gameselapsed++; 
    if (gamedata.game_crash < playgamecriteria) { 
        martingalewaitcount++;
        console.log("waited for " + martingalewaitcount + ' out of ' + gamewaitcount + ' games below ' + playgamecriteria + ' which is required to occur required before playing ') 
    } else { 
        martingalewaitcount = 0; 
        console.log("waited for " + martingalewaitcount + ' out of ' + gamewaitcount + ' games below ' + playgamecriteria + ' which is required to occur required before playing ') 
    }

    currentbalance = engine.getBalance(); 
    if (verbose == true) { 
        console.log("GAMES ELAPSED: " + gameselapsed); 
    } 

    if (cooldownelapsed >= cooldowncount) { 
        gamemode = 'MARTINGALE'; 
        console.log('reset to martingale after cooldown'); 
        cooldownelapsed = 0; 
    } else { 
        cooldownelapsed = cooldownelapsed + 1; 
    }
} 

function log_cashout_data(gamedata) { 
    if (verbose == true) {
        console.log('--------------------------------------------'); 
        console.log('Player cashed out - JSON shown below'); 
        console.log(JSON.stringify(gamedata)); 
    }
} 

function summarize_history(gamedata) { 
    medianvalues = []; 

    for (var gamehistoryitem in gamedata) {
      medianvalues.push(gamehistoryitem.game_crash); 
    }
    historicalmedian = median(medianvalues); 
    return historicalmedian; 

} 

function calculate_win_rate() { 
    if (numwinners > 0 && numlosers > 0) {
        var modifier =  numwinners / numlosers; 
        winrate = modifier*100;
    }
    if (numwinners > 0 && numlosers == 0){
        winrate = 100;
    }
    return winrate; 
} 

function calculate_net_profits() { 
    console.log("calculating net profits..."); 
    profits_have_changed = grosswinnings > 0 && grosslosses > 0; 
    var netchange = 0; 
    if (profits_have_changed == true){
        var oldnet = netprofits; 
        netprofits = ((grosswinnings / grosslosses ) * 100);
        netchange = oldnet - netprofits; 
        console.log("net profits have changed by " + netchange + " to " + netprofits); 
    } else { 
        console.log('net profits have not changed'); 
    }
    return netprofits; 
}

function summarize() { 
    totalprofit = grosswinnings - grosslosses; 
    if (verbose == true) { 
        console.log('============================================'); 
        console.log('==> Starting game... '); 
        console.log('==> Gross Winnings: ' + grosswinnings); 
        console.log('==> Gross Losses: ' + grosslosses); 
        console.log('==> Gain/Loss of ' + totalprofit); 
        console.log('==> # of games won: ' + numwinners); 
        console.log('==> # of games lost: ' + numlosers); 
        console.log('==> % of games won: ' + winrate + numlosers); 
        console.log('==> # of games elapsed: ' + gameselapsed); 
        console.log('============================================'); 

    } else { 
        console.log('starting new game -- wins: ' + numwinners + ' | losses: ' + numlosers + ' | grosswinnings: ' + grosswinnings + ' | grosslosses: ' + grosslosses + " | totalprofit: " + totalprofit); 
    }

}

function cocallback(gamedata) { 
    console.log("Cashed out!"); 
} 
function loadJSON(path, success, error) {
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    }; 
    xhr.open("GET", path, true);
    xhr.send();
}



loadJSON('transfer.json', function(data) { console.log(JSON.stringify(data)); }, function(xhr) { console.error(xhr); });
