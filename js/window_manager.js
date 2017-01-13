const remote = require('electron').remote;
const url = require('url');
const path = require('path');
var fs = require('fs');
var settings;

//WINDOW MANAGER BUTTONS

$("#close_app").click(function(){
    var window = remote.getCurrentWindow();
    window.close();
});

$("#minimize_app").click(function(){
    var window = remote.getCurrentWindow();
    window.minimize();
});

//LOAD PAGES

function loadPage(page){
    var content_url = url.format({
        pathname: path.join(__dirname, 'html/' + page)
    });
    fs.readFile(content_url, 'utf8', function(err, data){
        if (err){
            console.error("error reading " + page);
            throw err;
        }
        $(".content").animate({
            opacity: 0,
            top: 500
        }, function(){
            $(".content").attr('current_content', page);
            $(".content").html(data);
            $(".content").animate({
                opacity: 1,
                top: 65
            }, function(){
            
            });
        });
    });
}

$(".menu_bar_item").each(function(){
    $(this).click(function(){
        if (!$(this).attr("selected")){
            var page = $(this).attr('href');
            loadPage(page);
            $(".menu_bar_item").each(function(){
                $(this).removeAttr("selected");
            });
            $(this).attr("selected", "");
        }
    });
});

loadPage("home.html");

//LOAD SETTINGS

function LoadSettings(){
    fs.exists("settings.json", function(exists){
        if (exists){
            fs.readFile("settings.json", 'utf8', function(err, data){
                if (err){
                    throw err;
                }
                settings = JSON.parse(data);
            });
        } else {
            var data = '{"lol_install_location": "C:/Riot Games/League of Legends","lol_username": "TreeOfDeath","lol_region": "euw"}';
            settings = JSON.parse(data);
            fs.writeFile("settings.json", data, function(err){
                if (err){
                    throw err;
                }
            })
        }
    });
}

LoadSettings();

//CUSTOM DROP DOWN
$(".content").on("click", ".dropdown .selection", function(){
    $(this).attr("class", "selection_selected")
    $(this).parent().children(".options").css("display", "block");
});

$(".content").on("click", ".dropdown .options span", function(){
    if (!$(this).attr("id")){
        $(this).parent().parent().children(".selection_selected").attr("class", "selection");
        $(this).parent().css("display", "none");

        $(this).parent().parent().children(".selection").html($(this).html())
    }
});

$(document).mouseup(function(e){
    if ($(e.target).attr("class") != "selection" && $(e.target).attr("class") != "dropdown" && $(e.target).attr("class") != "options" && $(e.target).parent().attr("class") != "options")
    {
        $(".dropdown").each(function(){
            $(this).children(".selection_selected").attr("class", "selection");
            $(this).children(".options").css("display", "none");
        });
    }
});