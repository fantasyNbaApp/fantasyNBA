//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const fantasyApp = {};
//object that pulls API and runs entire program
let playerList = [];
//Entire list of players from API (cleaned up)
let playerStats = [];
//Entire list of player stats from API (cleaned up)
let fantasyPlayerList = [];
//List of Players entered by user
let rosterPlayer = "";
//Name of player typed
let rosterCount = 0;
//Number of players on your fantasy roster
let brokenName; 
//Array of strings with [0] = First Name and [1] = Last Name
let positionPG = [];
//Array of Point Guards from your fantasy roster
let positionSG = [];
//Array of Shooting Guards from your fantasy roster
let positionSF = [];
//Array of Small Forwards from your fantasy roster
let positionPF = [];
//Array of Power Forwards from your fantasy roster
let positionC = [];
//Array of Centers from your fantasy roster
let firstName;
let lastName;
let points;
let rebounds;
let assists;
let steals;

// Pts = 1
// Reb = 1.2
// Asst = 1.5
// Blk = 3
// Stl = 3
// Turnover = -1


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

fantasyApp.getPlayerStats = function () {
//Grabs Player Stats API
    $.ajax({
        url: 'http://proxy.hackeryou.com',
        dataType: 'json',
        method: 'GET',
        data: {
            reqUrl: 'https://www.fantasybasketballnerd.com/service/draft-projections',
            xmlToJSON: true,
            useCache: false
        }
    }).then((res) => {
        for (let i=0;i<res.FantasyBasketballNerd.Player.length;i++) {
            playerStats[i] = res.FantasyBasketballNerd.Player[i];
        }
        // console.log(playerStats);
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


fantasyApp.getPlayerInfo = function () {
//Grabbing Player Info API
    $.ajax({
        url: 'http://proxy.hackeryou.com',
        dataType: 'json',
        method: 'GET',
        data: {
            reqUrl: 'https://www.fantasybasketballnerd.com/service/players',
            xmlToJSON: true,
            useCache: false
        }
    }).then((res) => {
        for (let i=0;i<res.FantasyBasketballNerd.Player.length;i++) {
            playerList[i] = res.FantasyBasketballNerd.Player[i];
        }
        // console.log(playerList);
    })
}

fantasyApp.calculateValue = function (points, rebounds, assists, blocks, steals, turnovers ) {
//Determine value of player in order to sort players
// Pts = 1
// Reb = 1.2
// Asst = 1.5
// Blk = 3
// Stl = 3
// Turnover = -1
    return (points + rebounds*1.2 + assists*1.5 + blocks*3 + steals*3 - turnovers);
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


fantasyApp.getPlayer = function() {
    $.when(fantasyApp.getPlayerStats, fantasyApp.getPlayerInfo )
    //Ensures both APIs are pulled before moving forward with the code

    .then(() => {

        $('form').on('submit', function (e) {
            e.preventDefault();
            rosterPlayer = $('input[class="searchPlayer"]').val();

            for (let i=0;i<playerList.length;i++) {
                if (rosterPlayer === playerList[i].name) {

                    $('ul').append(`<li></span>${rosterPlayer}</li>`);
                    $('input[class="searchPlayer"]').val('');
                    fantasyPlayerList[rosterCount] = playerList[i];
                    
                    for (let j=0;j<playerStats.length;j++){

                        if (rosterPlayer == playerStats[j].name) {
                            //Break Player Name into Array with first and last name
                            brokenName = rosterPlayer.split(" ");
                            //Player Position
                            fantasyPlayerList[rosterCount].position =  playerStats[j].position;
                            //Number of Games Player has Played
                            fantasyPlayerList[rosterCount].games = Number(playerStats[j].Games);
                            //Points per Game
                            fantasyPlayerList[rosterCount].pointsPerGame = Number(((playerStats[j].PTS) / playerStats[j].Games).toFixed(1));
                            //Field Goal Percentage
                            fantasyPlayerList[rosterCount].fieldGoal = Number(playerStats[j].FG);
                            //Free Throw Percentage
                            fantasyPlayerList[rosterCount].freeThrow = Number(playerStats[j].FT);
                            //Rebounds per Game
                            fantasyPlayerList[rosterCount].rebounds = Number(((playerStats[j].REB) / playerStats[j].Games).toFixed(1));
                            //Assists per Game
                            fantasyPlayerList[rosterCount].assists = Number((playerStats[j].AST / playerStats[j].Games).toFixed(1));
                            //Blocks per Game
                            fantasyPlayerList[rosterCount].blocks = Number(((playerStats[j].BLK) / playerStats[j].Games).toFixed(1));
                            //Steals per Game
                            fantasyPlayerList[rosterCount].steals = Number(((playerStats[j].STL) / playerStats[j].Games).toFixed(1));
                            //Threes per Game
                            fantasyPlayerList[rosterCount].threesPerGame = Number(((playerStats[j].THREES) / playerStats[j].Games).toFixed(1));
                            //Minutes per Game
                            fantasyPlayerList[rosterCount].minutes = Number((playerStats[j].Minutes / playerStats[j].Games).toFixed(1));
                            //Turn Over per Game
                            fantasyPlayerList[rosterCount].turnOvers = Number(((playerStats[j].TO) / playerStats[j].Games).toFixed(1));
                            //Grabs all Player stats and inputs it into array

                            //Face Image of Player
                            fantasyPlayerList[rosterCount].imgURL = `https://nba-players.herokuapp.com/players/${brokenName[1]}/${brokenName[0]}`;
                            //Total Value of Player under fantasyPoints
                            // Pts = 1
                            // Reb = 1.2
                            // Asst = 1.5
                            // Blk = 3
                            // Stl = 3
                            // Turnover = -1
                            fantasyPlayerList[rosterCount].fantasyPoints = fantasyApp.calculateValue(fantasyPlayerList[rosterCount].pointsPerGame, fantasyPlayerList[rosterCount].rebounds, fantasyPlayerList[rosterCount].assists, fantasyPlayerList[rosterCount].blocks, fantasyPlayerList[rosterCount].steals, fantasyPlayerList[rosterCount].turnOvers);
                            
                        }
                    }
                    //Keep Track of Roster Count --> Output Unable to assemble team with less than 6 players and maximum count of 15
                    rosterCount++;
                }
                else {
                    //Clear text
                    $('input[class="searchPlayer"]').val('');
                }
            }
            console.log(fantasyPlayerList);
        
        })
    })
    }



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

fantasyApp.init = () => {
    fantasyApp.getPlayerStats();
    fantasyApp.getPlayerInfo();
    fantasyApp.getPlayer();
    fantasyApp.calculateValue();

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function(){
    fantasyApp.init();
});



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// console.log(res.FantasyBasketballNerd.Player[0].height);