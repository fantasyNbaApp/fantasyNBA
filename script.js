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
let totalFantasyWeeklyPoints;
//Weekily Fantasy Points Calculator
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
        console.log(res);
        for (let i = 0; i < res.FantasyBasketballNerd.Player.length; i++) {
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
        console.log(res);
        for (let i = 0; i < res.FantasyBasketballNerd.Player.length; i++) {
            playerList[i] = res.FantasyBasketballNerd.Player[i];
        }
        // console.log(playerList);
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

fantasyApp.calculateValue = function (points, rebounds, assists, blocks, steals, turnovers) {
    //Determine value of player in order to sort players
    // Pts = 1
    // Reb = 1.2
    // Asst = 1.5
    // Blk = 3
    // Stl = 3
    // Turnover = -1
    return (points + rebounds * 1.2 + assists * 1.5 + blocks * 3 + steals * 3 - turnovers);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function compareValue(a, b) {
    if (a.fantasyPoints < b.fantasyPoints) {
        return -1;
    }
    else if (a.fantasyPoints > b.fantasyPoints) {
        return 1;
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//BoardMessage For Each of the Stats/Info of the NBA Players

function boardMessageName(name) {
    return $(".playerName").text(name);
}

function boardMessageIMG(url) {
    const imgURL = `<img src="${url}">`;
    $(`.playerIMG`).html(imgURL);
}

function boardMessageTeam(team) {
    return $(".playerTeam").text(team);
}

function boardMessagePosition(pos) {
    return $(".playerPosition").text(pos);
}

function boardMessageHeight(height) {
    return $(".playerHeight").text(height);
}

function boardMessagePoints(points) {
    return $(".playerPoints").text(points);
}

function boardMessageRebounds(rebounds) {
    return $(".playerRebounds").text(rebounds);
}

function boardMessageAssit(assists) {
    return $(".playerAssists").text(assists);
}

function boardMessageFreeThrows(freeThrows) {
    return $(".playerFreeThrow").text(freeThrows);
}

function boardMessageThreePoints(threePoints) {
    return $(".playerThreePoints").text(threePoints);
}

function boardMessageFantasyPoints(fantasyPoints) {
    return $(".playerFantasyPoints").text(fantasyPoints);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

fantasyApp.getPlayer = function () {
    $.when(fantasyApp.getPlayerStats, fantasyApp.getPlayerInfo)
        //Ensures both APIs are pulled before moving forward with the code

        .then(() => {

            $('form').on('submit', function (e) {

                //Error Handling, only allow maximum 12 players to be submitted due to Yahoo Fantasy Fulls
                if (rosterCount > 11) {
                    alert("SEE YA L8R! YOU HAVE TOO MANY PLAYasS");
                    e.preventDefault();
                }

                else {
                    e.preventDefault();
                    rosterPlayer = $('input[class="searchPlayer"]').val();

                    let foundPlayer = false;
                    let hasPlayerName = false;


                    for (let i = 0; i < playerList.length; i++) {
                        if (rosterPlayer === playerList[i].name) {


                            foundPlayer = true;


                            //look for name in li list
                            let playerListItems = $('ul li');

                            for (let j = 0; j < playerListItems.length; j++) {

                                let playerName = $(playerListItems[j]).text();

                                if (playerName === rosterPlayer) {
                                    alert('Player Already added')
                                    hasPlayerName = true;
                                    return false

                                }
                            }

                            //Add Name to RosterList in HTML
                            if (!hasPlayerName) {
                                $('ul').append(`<li></span>${rosterPlayer}</li>`);
                            }

                            $('.playerCard').css("opacity", "1");
                            $('.playerCard').css("transition", "3s");

                            $(".playerInfoPlayerRoster").css("opacity","1");
                            $(".playerInfoPlayerRoster").css("transition", "0.5s");

                            //Search Search after Enter
                            $('input[class="searchPlayer"]').val('');
                            //Make an array of entered players with properties into fantasyPlayerList
                            fantasyPlayerList[rosterCount] = playerList[i];

                            //input all NBA player stats into fantasyPlayerList for entered names
                            for (let j = 0; j < playerStats.length; j++) {

                                if (rosterPlayer == playerStats[j].name) {
                                    //Break Player Name into Array with first and last name for img url
                                    brokenName = rosterPlayer.split(" ");
                                    //Player Position
                                    fantasyPlayerList[rosterCount].position = playerStats[j].position;
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
                                    fantasyPlayerList[rosterCount].fantasyPoints = Number(Number(fantasyApp.calculateValue(fantasyPlayerList[rosterCount].pointsPerGame, fantasyPlayerList[rosterCount].rebounds, fantasyPlayerList[rosterCount].assists, fantasyPlayerList[rosterCount].blocks, fantasyPlayerList[rosterCount].steals, fantasyPlayerList[rosterCount].turnOvers)).toFixed(1));

                                   

                                    //Output to Board All Player Info While It is being Typed
                                    boardMessageName(fantasyPlayerList[rosterCount].name);
                                    boardMessageIMG(fantasyPlayerList[rosterCount].imgURL);
                                    boardMessageTeam(fantasyPlayerList[rosterCount].team);
                                    boardMessagePosition(fantasyPlayerList[rosterCount].position);
                                    boardMessageHeight(fantasyPlayerList[rosterCount].height);
                                    boardMessagePoints(fantasyPlayerList[rosterCount].pointsPerGame);
                                    boardMessageAssit(fantasyPlayerList[rosterCount].assists);
                                    boardMessageRebounds(fantasyPlayerList[rosterCount].rebounds);
                                    boardMessageFreeThrows(fantasyPlayerList[rosterCount].freeThrow);
                                    boardMessageThreePoints(fantasyPlayerList[rosterCount].threesPerGame);
                                    boardMessageFantasyPoints(fantasyPlayerList[rosterCount].fantasyPoints);
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
                    // if player does not exist then alert 
                    if (!foundPlayer) {
                        alert('invalid player');
                    }
                }
            })

            $('.submit').on('click', function () {
                if (rosterPlayer === "") {
                    alert('no player entered');
                    return;
                }

                else if (fantasyPlayerList.length<12){
                    alert('not enough players entered');
                    return;
                }



                $('.submit').css("display", "none");
                $('.reset').css("width", "100%");
                $('.reset').css("border-radius" , "0 0 15px 15px");



                //Sort Players by Position and place into position array
                for (let i = 0; i < fantasyPlayerList.length; i++) {
                    if (fantasyPlayerList[i].position === "PG") {
                        positionPG.push(fantasyPlayerList[i]);
                    }
                    else if (fantasyPlayerList[i].position === "SG") {
                        positionSG.push(fantasyPlayerList[i]);
                    }
                    else if (fantasyPlayerList[i].position === "SF") {
                        positionSF.push(fantasyPlayerList[i]);
                    }
                    else if (fantasyPlayerList[i].position === "PF") {
                        positionPF.push(fantasyPlayerList[i]);
                    }
                    else if (fantasyPlayerList[i].position === "C") {
                        positionC.push(fantasyPlayerList[i]);
                    }
                }

                (positionPG.sort(compareValue)).reverse();
                (positionSG.sort(compareValue)).reverse();
                (positionSF.sort(compareValue)).reverse();
                (positionPF.sort(compareValue)).reverse();
                (positionC.sort(compareValue)).reverse();
                //Sorting function to output player by position and strengths

                console.log(positionPG);
                console.log(positionSG);
                console.log(positionSF);
                console.log(positionPF);
                console.log(positionC);

                //Sorting function for each position and outputs to the page when submit is clicked!

                for (let i = 0; i < positionPG.length; i++) {
                    $('.pointGuard').append(`<li></span>${positionPG[i].name}</li>`);
                }

                for (let i = 0; i < positionSG.length; i++) {
                    $('.shootingGuard').append(`<li></span>${positionSG[i].name}</li>`);
                }

                for (let i = 0; i < positionSF.length; i++) {
                    $('.smallForward').append(`<li></span>${positionSF[i].name}</li>`);
                }

                for (let i = 0; i < positionPF.length; i++) {
                    $('.powerForward').append(`<li></span>${positionPF[i].name}</li>`);
                }

                for (let i = 0; i < positionC.length; i++) {
                    $('.center').append(`<li></span>${positionC[i].name}</li>`);
                }
                
                totalFantasyWeeklyPoints = ((positionPG[0].fantasyPoints + positionSG[0].fantasyPoints + positionSF[0].fantasyPoints + positionPF[0].fantasyPoints + positionC[0].fantasyPoints + positionPG[1].fantasyPoints + positionSG[1].fantasyPoints + positionSF[1].fantasyPoints + positionPF[1].fantasyPoints + positionC[1].fantasyPoints)*3.5).toFixed(1);

                $('.weeklyCalc h3').text(`Your weekly projected fantasy points by this roster is: ${totalFantasyWeeklyPoints}`);
                
                //Output Starting Line Up
                $('.starting').append(`<li></span>${positionPG[0].name}</li>`);
                $('.starting').append(`<li></span>${positionSG[0].name}</li>`);
                $('.starting').append(`<li></span>${positionSF[0].name}</li>`);
                $('.starting').append(`<li></span>${positionPF[0].name}</li>`);
                $('.starting').append(`<li></span>${positionC[0].name}</li>`);
                
                //Output Bench
                $('.bench').append(`<li></span>${positionPG[1].name}</li>`);
                $('.bench').append(`<li></span>${positionSG[1].name}</li>`);
                $('.bench').append(`<li></span>${positionSF[1].name}</li>`);
                $('.bench').append(`<li></span>${positionPF[1].name}</li>`);
                $('.bench').append(`<li></span>${positionC[1].name}</li>`);
                




                


            })
        })


}

fantasyApp.resetButton = () => {
    $('.reset').on('click', function() {
        $('.searchPlayer').val("");
        location.reload();
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

fantasyApp.init = () => {
    fantasyApp.getPlayerStats();
    fantasyApp.getPlayerInfo();
    fantasyApp.getPlayer();
    fantasyApp.calculateValue();
    fantasyApp.resetButton();

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function () {
    fantasyApp.init();
});