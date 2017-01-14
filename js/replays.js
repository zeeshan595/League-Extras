var open = require('open');
var request_limit_message = "";
var match_history = null;
var summoner_data = null;
var champion_data = null;
var match_data = null;
var summoner_spell_data = null;

function Sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

function FormatNumbers(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
}

function ShowLoading(){
    $(".main_content").animate({
        opacity: 0
    }, function(){
        $(".main_content").css("display", "none");
        $(".loading").css("display", "block");
        $(".loading").animate({
            opacity: 1
        }, function(){});
    });
}

function HideLoading(){
    $(".loading").animate({
        opacity: 0
    }, function(){
        $(".loading").css("display", "none");
        $(".main_content").css("display", "block");
        $(".main_content").animate({
            opacity: 1
        }, function(){});
    });
}

function MatchHistoryUI(){
    for (var i = 0; i < match_data.length; i++){
        var platform_id = match_data[i].platformId;
        var match_index = match_data[i].matchId;
        var map_id = match_data[i].mapId;
        var time_stamp = new Date(match_data[i].matchCreation);
        var participent_number;
        var profile_icon;
        var champion_key;
        var champion_name;
        var summoner_spell_1_id;
        var summoner_spell_2_id;
        var summoner_spell_1;
        var summoner_spell_2;
        var team_id;
        var victory;
        var summoner_items_ids;
        var minions_killed;
        var total_gold_earned;
        var match_mode = match_data[i].matchMode;
        var total_kills;
        var total_deaths;
        var total_assists;
        for (var j = 0; j < match_data[i].participantIdentities.length; j++){
            if (match_data[i].participantIdentities[j].player.summonerId == summoner_data['id']){
                participent_number = match_data[i].participantIdentities[j].participantId;
                profile_icon = match_data[i].participantIdentities[j].player.profileIcon;
                champion_key = match_data[i].participants[j].championId;
                for (var k = 0; k < champion_data.length; k++){
                    if (champion_data[k].value.key == champion_key){
                        champion_name = champion_data[k].index;
                        break;
                    }
                }
                summoner_spell_1_id = match_data[i].participants[j].spell1Id;
                summoner_spell_2_id = match_data[i].participants[j].spell2Id;
                team_id = match_data[i].participants[j].teamId;
                for (var k = 0; k < match_data[i].teams.length; k++){
                    if (match_data[i].teams[k].teamId == team_id){
                        victory = match_data[i].teams[k].winner;
                        break;
                    }
                }
                for (var k = 0; k < summoner_spell_data.length; k++){
                    if (summoner_spell_data[k].value.key == summoner_spell_1_id){
                        summoner_spell_1 = summoner_spell_data[k].value.id;
                    }
                    if (summoner_spell_data[k].value.key == summoner_spell_2_id){
                        summoner_spell_2 = summoner_spell_data[k].value.id;
                    }
                }
                summoner_items_ids = [];
                summoner_items_ids[0] = match_data[i].participants[j].stats.item0;
                summoner_items_ids[1] = match_data[i].participants[j].stats.item1;
                summoner_items_ids[2] = match_data[i].participants[j].stats.item2;
                summoner_items_ids[3] = match_data[i].participants[j].stats.item3;
                summoner_items_ids[4] = match_data[i].participants[j].stats.item4;
                summoner_items_ids[5] = match_data[i].participants[j].stats.item5;
                summoner_items_ids[6] = match_data[i].participants[j].stats.item6;
                minions_killed = match_data[i].participants[j].stats.minionsKilled;
                total_gold_earned = match_data[i].participants[j].stats.goldEarned;
                total_kills = match_data[i].participants[j].stats.kills;
                total_deaths = match_data[i].participants[j].stats.deaths;
                total_assists = match_data[i].participants[j].stats.assists;
                break;
            }
        }
        new_item = '<div class="replay" href="http://matchhistory.'+settings.lol_region+'.leagueoflegends.com/en/#match-details/'+platform_id+'/'+match_index+'/1?tab=overview">';
        new_item += '<div class="champion_image" style="background-image: url(\'http://ddragon.leagueoflegends.com/cdn/7.1.1/img/champion/'+champion_name+'.png\');"></div>';
        new_item += '<div class="information">';
        if (victory){
            new_item += '<div class="who_won" style="color: rgba(0, 218, 255, 0.74);">VICTORY</div>';
        } else{
            new_item += '<div class="who_won" style="color: rgba(255, 0, 0, 0.74);">DEFEAT</div>';
        }
        new_item += '<div class="game_type">'+match_mode+'</div>';
        new_item += '<div class="summoner_spells">';
        new_item += '<div class="spell" style="background-image: url(\'http://ddragon.leagueoflegends.com/cdn/7.1.1/img/spell/'+summoner_spell_1+'.png\');"></div>';
        new_item += '<div class="spell" style="background-image: url(\'http://ddragon.leagueoflegends.com/cdn/7.1.1/img/spell/'+summoner_spell_2+'.png\');"></div>';
        new_item += '</div>';
        new_item += '</div>';
        new_item += '<div class="items">';
        new_item += '<div class="items_bar">';
        for (var j = 0; j < summoner_items_ids.length; j++){
            new_item += '<div class="item" style="background-image: url(\'http://ddragon.leagueoflegends.com/cdn/7.1.1/img/item/'+summoner_items_ids[j]+'.png\');"></div>';
        }
        new_item += '</div>';
        new_item += '<div class="info">';
        new_item += '<span>'+total_kills+' / '+total_deaths+' / '+total_assists+'</span>';
        new_item += '<span>'+minions_killed+'</span>';
        new_item += '<span>'+FormatNumbers(total_gold_earned)+'</span>';
        new_item += '</div>';
        new_item += '</div>';
        new_item += '<div class="extra">';
        new_item += '<div>';
        if (map_id == 10){
            new_item += 'Twisted Treeline';
        } else if (map_id == 11){
            new_item += 'Summoners Rift';
        } else if (map_id == 12){
            new_item += 'Howling Abyss';
        } else{

        }
        new_item += '</div>';
        console.log(time_stamp);
        new_item += '<div>' + time_stamp.getDate() + '/' + (time_stamp.getMonth() + 1) + '/' + time_stamp.getFullYear() + '</div>';
        new_item += '<div>' + time_stamp.getHours() + ':' + time_stamp.getMinutes() + '</div>';
        new_item += '</div>';
        new_item += '</div>';

        $(".replays_list").append(new_item);
        HideLoading();
    }

    $(".replay").click(function(){
        open($(this).attr('href'));
    });
}

function SendDelayedMatchQuery(index){
    var failed = false;
    setTimeout(function(){
        $(".loading .loading_data").html("Getting Match Data: " + (index + 1) + "/" + (2 + 1));
        $.ajax({
            url: 'https://'+settings.lol_region+'.api.pvp.net/api/lol/euw/v2.2/match/'+match_history[index]+'?api_key=RGAPI-f71101e0-0cd6-463c-8469-08f98d3d2475',
            dataType: 'json',
            type: 'GET',
            cache: true,
            success: function(data){
                match_data[index] = data;
                if (index == 2 && !failed){
                    MatchHistoryUI();
                }
            },
            error: function(xhr, status, error){
                failed = true;
                $(".loading .loading_data").html("ERROR (SendDelayedMatchQuery): " + error);
            }
        });
    }, 2000 * (index + 1));
}

function GetMatchData(){
    match_data = [];
    for (var i = 0; i < 3; i++){
        SendDelayedMatchQuery(i);
    }
}

function GetMatchHistory(){
    $(".loading .loading_data").html("Waiting For RIOT");
    setTimeout(function(){
        $(".loading .loading_data").html("Downloading Match History");
        $.ajax({
            url: 'https://'+settings.lol_region+'.api.pvp.net/api/lol/euw/v2.2/matchlist/by-summoner/'+summoner_data['id']+'?api_key=RGAPI-f71101e0-0cd6-463c-8469-08f98d3d2475',
            dataType: 'json',
            type: 'GET',
            cache: false,
            success: function(data){
                match_history = $.map(data.matches, function(value, index) {
                    return value.matchId;
                });
                GetMatchData();
            },
            error: function(xhr, status, error){
                $(".loading .loading_data").html("ERROR (GetMatchHistory): " + error);
            }
        });
    }, 2000);
}

function GetSummonerData(){
    $(".loading .loading_data").html("Waiting For RIOT");
    setTimeout(function(){
        $(".loading .loading_data").html("Fetching Summoner Data");
        $.ajax({
            url: 'https://'+settings.lol_region+'.api.pvp.net/api/lol/euw/v1.4/summoner/by-name/'+settings.lol_username+'?api_key=RGAPI-f71101e0-0cd6-463c-8469-08f98d3d2475',
            dataType: 'json',
            type: 'GET',
            cache: false,
            success: function(data){
                summoner_data = data[settings.lol_username.toLowerCase()];
                GetMatchHistory();
            },
            error: function(xhr, status, error){
                $(".loading .loading_data").html("ERROR (GetSummonerData): " + error);
            }
        });
    }, 2000);
}

function GetChampionData(){
    $(".loading .loading_data").html("Fetching Champion Data");
    $.ajax({
        url: 'http://ddragon.leagueoflegends.com/cdn/7.1.1/data/en_US/champion.json',
        dataType: 'json',
        type: 'GET',
        cache: false,
        success: function(data){
            champion_data = $.map(data.data, function(value, index) {
                return {index, value};
            });
            GetSummonerData();
        },
        error: function(xhr, status, error){
            $(".loading .loading_data").html("ERROR (GetChampionData): " + error);
        }
    });
}

function GetSummonerSpells(){
    $.ajax({
        url: 'http://ddragon.leagueoflegends.com/cdn/7.1.1/data/en_US/summoner.json',
        dataType: 'json',
        type: 'GET',
        cache: false,
        success: function(data){
            summoner_spell_data = $.map(data.data, function(value, index) {
                return {index, value};
            });
            GetChampionData();
        },
        error: function(xhr, status, error){
            $(".loading .loading_data").html("ERROR (GetSummonerSpells): " + error);
        }
    });
}

$(".content").bind("DOMNodeInserted", function(e){
    if ($(".content").attr("current_content") == "replays.html" && $(e.target).attr("class") == "replays"){
        GetSummonerSpells();
    }
});