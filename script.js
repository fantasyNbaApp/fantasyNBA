//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const fantasyApp = {};
//object that pulls API and runs entire program
let playerList = [];
//Entire list of players from API (cleaned up)
let fantasyPlayerList = [];
//List of Players entered by user
let rosterPlayer = "";
//Name of player typed
let rosterCount = 0;
//Number of players on your fantasy roster
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

fantasyApp.getPlayer = function() {
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

    }).then(() => {
        $('form').on('submit', function (e) {

            e.preventDefault();
            rosterPlayer = $('input[class="searchPlayer"]').val();

            for (let i=0;i<playerList.length;i++) {
                if (rosterPlayer == playerList[i].name) {
                    $('ul').append(`<li></span>${rosterPlayer}</li>`);
                    $('input[class="searchPlayer"]').val('');
                    fantasyPlayerList[rosterCount] = playerList[i];
                    rosterCount++;
                }
                else {
                    $('input[class="searchPlayer"]').val('');
                }
            }

        })
    }).then(() => {
        $('button').on('click',function() {
            $.ajax({
                url: 'http://proxy.hackeryou.com',
                dataType: 'json',
                method: 'GET',
                data: {
                    reqUrl: 'https://www.fantasybasketballnerd.com/service/draft-projections',
                    xmlToJSON: true,
                    useCache: false
                }
        })
    }).then((data) => {
        console.log(data);
    })
    })}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

fantasyApp.init = () => {
    fantasyApp.getPlayer();

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function(){
    fantasyApp.init();
});



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// console.log(res.FantasyBasketballNerd.Player[0].height);