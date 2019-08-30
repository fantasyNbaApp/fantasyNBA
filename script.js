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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


fantasyApp.getPlayer = function() {
    $.when(fantasyApp.getPlayerStats, fantasyApp.getPlayerInfo )

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
                            fantasyPlayerList[rosterCount].position =  playerStats[j].position;
                            fantasyPlayerList[rosterCount].games = playerStats[j].Games;
                            fantasyPlayerList[rosterCount].pointsPerGame = ((playerStats[j].PTS) / playerStats[j].Games).toFixed(1);
                            fantasyPlayerList[rosterCount].fieldGoal = (playerStats[j].FG);
                            fantasyPlayerList[rosterCount].freeThrow = (playerStats[j].FT);
                            fantasyPlayerList[rosterCount].rebounds = ((playerStats[j].REB) / playerStats[j].Games).toFixed(1);
                            fantasyPlayerList[rosterCount].assists = (playerStats[j].AST / playerStats[j].Games).toFixed(1);
                            fantasyPlayerList[rosterCount].blocks = ((playerStats[j].BLK) / playerStats[j].Games).toFixed(1);
                            fantasyPlayerList[rosterCount].steals = ((playerStats[j].STL) / playerStats[j].Games).toFixed(1);
                            fantasyPlayerList[rosterCount].threesPerGame = ((playerStats[j].THREES) / playerStats[j].Games).toFixed(1);
                            fantasyPlayerList[rosterCount].minutes = (playerStats[j].Minutes / playerStats[j].Games).toFixed(1);
                            fantasyPlayerList[rosterCount].turnOvers = ((playerStats[j].TO) / playerStats[j].Games).toFixed(1);
                        }
                    }
                    rosterCount++;
                }
                else {
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

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function(){
    fantasyApp.init();
});



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// console.log(res.FantasyBasketballNerd.Player[0].height);