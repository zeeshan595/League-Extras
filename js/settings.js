var fs = require('fs');

$(".content").bind("DOMNodeInserted", function(e){
    if ($(".content").attr("current_content") == "settings.html" && $(e.target).attr("class") == "settings"){
        $("#lol_install_location").val(settings.lol_install_location);
        $("#lol_username").val(settings.lol_username);

        $("#lol_install_location").on("input", function(){
            $('#save_button').attr('class', 'save_button');
        });
        $("#lol_username").on("input", function(){
            $('#save_button').attr('class', 'save_button');
        });
        $(".dropdown .selection").click(function(){
            $('#save_button').attr('class', 'save_button');
        });

        $("#save_button").click(function(){
            if ($('#save_button').attr('class') == 'save_button'){
                $('#save_button').attr('class', 'save_button_disabled');

                settings.lol_install_location = $("#lol_install_location").val();
                settings.lol_username = $("#lol_username").val();

                fs.writeFile("settings.json", JSON.stringify(settings), function(err){
                    if (err){
                        throw err;
                    }
                });
            }
        });
    }
});