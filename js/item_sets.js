var fs = require('fs');
var champions_data;
var items_data;
var item_sets_data;
var category_selected = [];
var champion_category_selected = [];
var currently_item_set = 0;

function LoadItemsUI(){
    //load items list
    $(".items_list").empty();
    var new_items_list_string = "";
    for (var i = 0; i < items_data.length; i++){
        var search_pass = false;
        var category_pass = false;
        var map_check = false;
        if (category_selected.length > 0){
            var L = 0;
            for (var j = 0; j < items_data[i].value.tags.length; j++){
                for (var k = 0; k < category_selected.length; k++){
                    if (category_selected[k] == items_data[i].value.tags[j]){
                        L++;
                    }
                }
            }
            if (L == category_selected.length){
                category_pass = true;
            }
        } else{
            category_pass = true;
        }
        if (items_data[i].value.name.toLowerCase().indexOf($(".items_tab .search").val().toLowerCase()) != -1){
            search_pass = true;
        }
        if (item_sets_data && item_sets_data.length > 0){
            for (var j = 0; j < item_sets_data[currently_item_set].associatedMaps.length; j++){
                if (items_data[i].value.maps[parseInt(item_sets_data[currently_item_set].associatedMaps)]){
                    map_check = true;
                    break;
                }
            }
        }
        if (search_pass && category_pass && map_check){
            new_items_list_string += "<div class='lol_item' index='"+i+"' style=\"background: url('http://ddragon.leagueoflegends.com/cdn/7.1.1/img/item/"+items_data[i].index+".png'); background-size: 100%;\"></div>";
        }
    }
    $(".items_list").html(new_items_list_string);
    $(".lol_item").draggable({
        helper: 'clone',
        revert: 'invalid',
        appendTo: 'body',
        start: function(e, u){
            $(u.helper).css("z-index", "1000");
            $(u.helper).css("width", "50px");
            $(u.helper).css("height", "50px");
        }
    });
}

function LoadMapUI(){
    if (item_sets_data[currently_item_set].associatedMaps.indexOf(10) != -1){
        $(".maps_tab #10").attr("selected", "");
    } else if ($(".maps_tab #10").attr("selected")){
        $(".maps_tab #10").removeAttr("selected", "");
    }

    if (item_sets_data[currently_item_set].associatedMaps.indexOf(11) != -1){
        $(".maps_tab #11").attr("selected", "");
    } else if ($(".maps_tab #11").attr("selected")){
        $(".maps_tab #11").removeAttr("selected", "");
    }

    if (item_sets_data[currently_item_set].associatedMaps.indexOf(12) != -1){
        $(".maps_tab #12").attr("selected", "");
    } else if ($(".maps_tab #12").attr("selected")){
        $(".maps_tab #12").removeAttr("selected", "");
    }
}

function LoadBlockUI(){
    $(".blocks_list").children().each(function(){
        if ($(this).attr("class") != "add_block"){
            $(this).remove();
        }
    });

    if (item_sets_data[currently_item_set].blocks && item_sets_data[currently_item_set].blocks.length > 0)
    {
        for (var i = 0; i < item_sets_data[currently_item_set].blocks.length; i++){
            var new_block = '<div class="block" index="'+i+'"><input type="text" class="name" placeholder="My Block" value="'+item_sets_data[currently_item_set].blocks[i].type+'" /><div class="delete_block">x</div>';
            for (var j = 0; j < item_sets_data[currently_item_set].blocks[i].items.length; j++){
                var item_id = 0;
                for (var k = 0; k < items_data.length; k++){
                    if (item_sets_data[currently_item_set].blocks[i].items[j].id == items_data[k].index){
                        item_id = k;
                        break;
                    }
                }
                new_block += "<div class='lol_item' index='"+item_id+"' style=\"background: url('http://ddragon.leagueoflegends.com/cdn/7.1.1/img/item/"+item_sets_data[currently_item_set].blocks[i].items[j].id+".png'); background-size: 100%;\"></div>";
            }
            new_block += '</div>';
            $(new_block).insertBefore(".blocks_list .add_block");
        }
    }
    BindBlockEvents();
}

function LoadChampionUI(){
    $(".champions_list").empty();
    for (var i = 0; i < champions_data.length; i++){
        var category_pass = false;
        var search_pass = false;
        var L = 0;
        for (var j = 0; j < champions_data[i].value.tags.length; j++){
            for (var k = 0; k < champion_category_selected.length; k++){
                if (champion_category_selected[k] == champions_data[i].value.tags[j]){
                    L++;
                }
            }
        }
        if (L == champion_category_selected.length){
            category_pass = true;
        }
        if (champions_data[i].value.id.toLowerCase().indexOf($(".category_bar .search").val().toLowerCase()) != -1){
            search_pass = true;
        }

        if (category_pass && search_pass){
            var selected_champ = "";
            if (item_sets_data.length > 0){
                for (var x = 0; x < item_sets_data[currently_item_set].associatedChampions.length; x++){
                    if (item_sets_data[currently_item_set].associatedChampions[x] == champions_data[i].value.id){
                        selected_champ = "selected";
                    }
                }
            }
            $(".champions_list").append("<div class='champion' "+selected_champ+" index='"+i+"' style=\"background: url('http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/"+champions_data[i].value.id+".png'); background-size: 100%;\"></div>");
        }
    }
}

function LoadSavedItemSets(){
    $(".loading_data").html("Reading Stored Item Sets");
    fs.exists(settings.lol_install_location + "/Config/ItemSets.json", function(exists){
        if (exists){
            var data = fs.readFileSync(settings.lol_install_location + "/Config/ItemSets.json", 'utf8');
            item_sets_data = JSON.parse(data).itemSets;
            if (item_sets_data.length == 0){
                var default_item_set = {};
                default_item_set.associatedChampions = [];
                default_item_set.associatedMaps = [ 11 ];
                default_item_set.blocks = [];
                default_item_set.isGlobalForChampions = true;
                default_item_set.isGlobalForMaps = true;
                default_item_set.map = "any";
                default_item_set.mode = "any";
                default_item_set.priority = false;
                default_item_set.sortrank = 4;
                default_item_set.type = "global";
                default_item_set.title = 1;
                item_sets_data[0] = default_item_set;
            }
        }
        else{
            $(".loading_data").html("Could not find any item sets");
            var default_item_set = {};
            default_item_set.associatedChampions = [];
            default_item_set.associatedMaps = [ 11 ];
            default_item_set.blocks = [];
            default_item_set.isGlobalForChampions = true;
            default_item_set.isGlobalForMaps = true;
            default_item_set.map = "any";
            default_item_set.mode = "any";
            default_item_set.priority = false;
            default_item_set.sortrank = 4;
            default_item_set.type = "global";
            default_item_set.title = 1;
            item_sets_data[0] = default_item_set;
        }

            $(".dropdown .options").empty();
            if (item_sets_data != null && item_sets_data.length > 0){
            for (var i = 0; i < item_sets_data.length; i++){
                $(".dropdown .options").append("<span index='"+i+"'>"+item_sets_data[i].title+"</span>");
            }
            $(".dropdown .selection").html(item_sets_data[0].title);
            LoadBlockUI();
            LoadMapUI();
        }
        LoadItemsUI();
        LoadChampionUI();
        $(".loading_data").html("Finished");
    });
    
    $(".loading").animate({
        opacity: 0
    }, function(){
        $(".loading").css("display", "none");
        $(".item_sets_content").css("display", "block");
        $(".item_sets_content").animate({
            opacity: 1
        }, function (){

        });
    });
}

function LoadChampionsData(){
    $(".loading_data").html("Fetching Champions Data");
    $.ajax({
        url: "http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json",
        dataType: 'json',
        type: 'GET',
        cache: false,
        success: function(data){
            champions_data = $.map(data.data, function(value, index) {
                return {index, value};
            });
            LoadSavedItemSets();
        },
        error: function(xhr, status, error){
            champions_data = null;
            console.error("ERROR: could not load champion data");
        }
    });
}

function LoadItemsData(){
    $(".loading_data").html("Fetching Items Data");
    $.ajax({
        url: 'http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/item.json',
        dataType: 'json',
        type: 'GET',
        cache: false,
        success: function(data){
            items_data = $.map(data.data, function(value, index) {
                return {index, value};
            });
            items_data.sort(function(a,b){
                return a.value.gold.total - b.value.gold.total;
            });
            LoadChampionsData();
        },
        error: function(xhr, status, error){
            console.log("could not load items data");
        }
    });
}

function BindBlockEvents(){
    $(".block").droppable({
        accept: '.lol_item',
        drop: function (e, u){
            var dropped = $(u.helper.clone());
            $(this).append(dropped);
            dropped.css("position", "relative");
            dropped.css("top", "0");
            dropped.css("left", "0");
            dropped.css("z-index", "1");
            dropped.removeClass("ui-draggable");
            dropped.removeClass("ui-draggable-handle");
            dropped.removeClass("ui-draggable-dragging");
            $("#info_box").css("opacity", "0");
            $("#save_button").attr("class", "save_button");
            var new_item = {};
            new_item.count = 1;
            new_item.id = items_data[dropped.attr("index")].index;
            item_sets_data[currently_item_set].blocks[$(this).attr('index')].items.push(new_item);
        }
    });

    $(".block input").on("input", function(){
        item_sets_data[currently_item_set].blocks[$(this).parent().attr("index")].type = $(this).val();
        $("#save_button").attr("class", "save_button");
    });
}

$(".content").bind("DOMNodeInserted", function(e){
    if ($(".content").attr("current_content") == "item_sets.html" && $(e.target).attr("class") == "item_sets"){
        item_sets_data = [];
        category_selected = [];
        champion_category_selected = [];
        currently_item_set = 0;
        LoadItemsData();

        $(".items_tab .search").on("input", function(){
            LoadItemsUI();
        });
        $(".category_bar .search").on("input", function(){
            LoadChampionUI();
        });

        $(".items_list_filter input[type=checkbox]").change(function(){
            if ($(this).is(':checked')){
                category_selected.push($(this).val());
            }else {
                var index = category_selected.indexOf($(this).val());
                if (index != -1){
                    category_selected.splice(index, 1)
                }
            }
            LoadItemsUI();
        });

        $(".items_tab").on("mouseenter", ".lol_item", function(){
            $("#info_box").html(items_data[$(this).attr("index")].value.description);
            $("#info_box").css("opacity", "1");
        });
        $(".items_tab").on("mouseleave", ".lol_item", function(){
            $("#info_box").css("opacity", "0");
            $("#info_box").css("left", "1524px");
        });
        $(".items_tab").mousemove(function(e){
            if ($("#info_box").width() + e.pageX + 10 < 1024){
                $("#info_box").css("left", e.pageX + 20);
            }else{
                $("#info_box").css("left", e.pageX - 30 - $("#info_box").width());
            }

            if ($("#info_box").height() + e.pageY + 20 < 720){
                $("#info_box").css("top", e.pageY + 10);
            }else{
                $("#info_box").css("top", e.pageY - 10 - $("#info_box").height());
            }

            if ($("#info_box").css("opacity") == 0){
                $("#info_box").css("left", "1524px");
            }
        });
        $(".blocks_list").on("click", ".lol_item", function(){
            for (var i = 0; i < items_data.length; i++){
                for (var j = 0; j < item_sets_data[currently_item_set].blocks[$(this).parent().attr('index')].items.length; j++){
                    if (item_sets_data[currently_item_set].blocks[$(this).parent().attr('index')].items[j].id == items_data[i].index && i == $(this).attr("index")){
                        item_sets_data[currently_item_set].blocks[$(this).parent().attr('index')].items.splice(j, 1);
                        break;
                    }
                }
            }
            $(this).remove();
            $("#info_box").css("opacity", "0");
            $("#save_button").attr("class", "save_button");
        });
        $(".add_block").click(function(){
            $('<div class="block" index="'+item_sets_data[currently_item_set].blocks.length+'"><input type="text" class="name" placeholder="My Block" /><div class="delete_block">x</div></div>').insertBefore(".blocks_list .add_block");
            var new_block = {};
            new_block.type = "new block";
            new_block.items = [];
            item_sets_data[currently_item_set].blocks.push(new_block);
            BindBlockEvents();
            $("#save_button").attr("class", "save_button");
        });
        $(".blocks_list").on("click", ".delete_block", function(){
            item_sets_data[currently_item_set].blocks.splice($(this).parent().attr('index'), 1);
            $(this).parent().remove();
            $("#save_button").attr("class", "save_button");
        });

        $(".tabs span").on("click", function(){
            var selected_tab = $(this).attr("href");
            $(this).parent().children().each(function(){
                var current_tab = $(this);
                if (selected_tab != current_tab.attr("href"))
                {
                    $("." + current_tab.attr("href")).animate({
                        opacity: 0,
                    }, function(){
                        $("." + current_tab.attr("href")).css("display", "none");
                    });
                } else{
                    $("." + current_tab.attr("href")).css("display", "block");
                    $("." + current_tab.attr("href")).animate({
                        opacity: 1,
                    }, function(){

                    });
                }                    
            });

            $(this).parent().children().each(function(){
                $(this).removeAttr("selected");
            });
            $(this).attr("selected", "");
        });
        $(".dropdown").on("click", ".options span", function(){
            currently_item_set = $(this).attr('index');
            LoadBlockUI();
            LoadChampionUI();
            LoadMapUI();
        });
        $("#add_new_button").click(function(){
            if ($(".edit_text").css("display") == "none"){
                var default_item_set = {};
                default_item_set.associatedChampions = [];
                default_item_set.associatedMaps = [ 11 ];
                default_item_set.blocks = [];
                default_item_set.isGlobalForChampions = true;
                default_item_set.isGlobalForMaps = true;
                default_item_set.map = "any";
                default_item_set.mode = "any";
                default_item_set.priority = false;
                default_item_set.sortrank = 4;
                default_item_set.type = "global";
                default_item_set.title = item_sets_data.length;
                
                $("#save_button").attr("class", "save_button");
                $('.dropdown .options').append('<span index="'+item_sets_data.length+'">'+item_sets_data.length+'</span>');

                $('.dropdown .selection').html(item_sets_data.length);
                currently_item_set = item_sets_data.length;

                if (item_sets_data == null){
                    item_sets_data = [];
                    item_sets_data.push(default_item_set);
                } else{
                    item_sets_data.push(default_item_set);
                }
                LoadMapUI();
                LoadChampionUI();
                LoadBlockUI();
            }
        });

        $("#save_button").click(function(){
            if ($(this).attr('class') == "save_button" && $(".edit_text").css("display") == "none"){
                fs.writeFile(settings.lol_install_location + "/Config/ItemSets.json", '{"itemSets":' + JSON.stringify(item_sets_data) + ',"timeStamp":1484201251734}', function(err){
                    if (err){
                        throw err;
                    }
                    
                });
                for (var i = 0; i < champions_data.length; i++){
                    var path_to_champ_data = settings.lol_install_location + "/Config/Champions/" + champions_data[i].value.id + "/Recommended/";
                    if (fs.existsSync(path_to_champ_data)){
                        var files = fs.readdirSync(path_to_champ_data);

                        for (var j = 0; j < files.length; j++){
                            fs.unlinkSync(path_to_champ_data + files[j]);
                        }
                    }
                }
                for (var i = 0; i < item_sets_data.length; i++){
                    for (var j = 0; j < item_sets_data[i].associatedChampions.length; j++){
                        var path_to_champ_folder = settings.lol_install_location + "/Config/Champions/" + item_sets_data[i].associatedChampions[j] + "/";
                        if (!fs.existsSync(path_to_champ_folder)){
                            fs.mkdirSync(path_to_champ_folder);
                            fs.mkdirSync(path_to_champ_folder + "Recommended/");
                        }
                        fs.writeFileSync(path_to_champ_folder + "Recommended/RIOT_ItemSet_"+i+".json", JSON.stringify(item_sets_data[i]));
                    }
                }

                $(this).attr('class', "save_button_disabled");
            }
        });

        $(".category").click(function(){
            if ($(this).attr("selected")){
                $(this).removeAttr("selected");
                var index = champion_category_selected.indexOf($(this).attr("id"))
                if (index != -1 ){
                    champion_category_selected.splice(index, 1);
                }
            } else {
                $(this).attr("selected", "");
                champion_category_selected.push($(this).attr("id"));
            }
            LoadChampionUI();
        });

        $(".champions_list").on("click", ".champion", function(){
            if ($(this).attr("selected")){
                $(this).removeAttr("selected");
                var index = item_sets_data[currently_item_set].associatedChampions.indexOf(champions_data[$(this).attr("index")].value.id);
                if (index != -1){
                    item_sets_data[currently_item_set].associatedChampions.splice(index, 1);
                }
            } else{
                $(this).attr("selected", "");
                if (item_sets_data[currently_item_set].associatedChampions == null){
                    item_sets_data[currently_item_set].associatedChampions = [];
                }
                item_sets_data[currently_item_set].associatedChampions.push(champions_data[$(this).attr("index")].value.id);
            }
            $("#save_button").attr("class", "save_button");
        });

        $("#delete_button").click(function(){
            if ($(".edit_text").css("display") == "none"){
                if (currently_item_set == 0){
                    $(".dropdown .options").empty();
                    $(".dropdown .options").append("<span index='0'>1</span>");
                    $(".dropdown .selection").html("1");
                    var default_item_set = {};
                    default_item_set.associatedChampions = [];
                    default_item_set.associatedMaps = [ 11 ];
                    default_item_set.blocks = [];
                    default_item_set.isGlobalForChampions = true;
                    default_item_set.isGlobalForMaps = true;
                    default_item_set.map = "any";
                    default_item_set.mode = "any";
                    default_item_set.priority = false;
                    default_item_set.sortrank = 4;
                    default_item_set.type = "global";
                    default_item_set.title = "my item set";
                    item_sets_data[0] = default_item_set;
                    LoadMapUI();
                    LoadChampionUI();
                    LoadBlockUI();
                }else if (currently_item_set > 0){
                    item_sets_data.splice(currently_item_set, 1);
                    $(".dropdown .options").empty();
                    for (var i = 0; i < item_sets_data.length; i++){
                        $(".dropdown .options").append("<span index='"+i+"'>"+item_sets_data[i].title+"</span>");
                    }
                    $(".dropdown .selection").html(item_sets_data[currently_item_set - 1].title);
                    currently_item_set--;
                    LoadMapUI();
                    LoadChampionUI();
                    LoadBlockUI();
                }else{
                    console.error("some went wrong...");
                }
                $("#save_button").attr("class", "save_button");
            }
        });

        $(".maps_tab .maps").click(function(){
            if ($(this).attr("selected")){
                $(this).removeAttr("selected");
                var map_top_remove = item_sets_data[currently_item_set].associatedMaps.indexOf(parseInt($(this).attr("id")));
                if (map_top_remove != -1){
                    item_sets_data[currently_item_set].associatedMaps.splice(map_top_remove, 1);
                }
            } else{
                $(this).attr("selected", "");
                item_sets_data[currently_item_set].associatedMaps.push(parseInt($(this).attr("id")));
            }
            $("#save_button").attr("class", "save_button");
            LoadItemsUI();
        });

        $(".edit_button").click(function(){
            if ($(".edit_text").css("display") == "none"){
                $(".edit_text").css("display", "inline-block");
                $(".dropdown").css("display", "none");
                $(".edit_text").val($(".dropdown .selection").html());
                $("#delete_button").css("opacity", "0.3");
                $("#add_new_button").css("opacity", "0.3");
                $("#save_button").attr("class", "save_button_disabled");
            } else{
                $(".edit_text").css("display", "none");
                $(".dropdown").css("display", "inline-block");
                $(".dropdown .selection").html($(".edit_text").val());
                $("#delete_button").css("opacity", "0.9");
                $("#add_new_button").css("opacity", "0.9");
                item_sets_data[currently_item_set].title = $(".edit_text").val();

                $(".dropdown .options").empty();
                for (var i = 0; i < item_sets_data.length; i++){
                    $(".dropdown .options").append("<span index='"+i+"'>"+item_sets_data[i].title+"</span>");
                }
                $(".dropdown .selection").html(item_sets_data[currently_item_set].title);
                $("#save_button").attr("class", "save_button");
            }
        });
        $('.edit_text').keyup(function(e){
            if(e.keyCode == 13)
            {
                $(".edit_text").css("display", "none");
                $(".dropdown").css("display", "inline-block");
                $(".dropdown .selection").html($(".edit_text").val());
                $("#delete_button").css("opacity", "0.9");
                $("#add_new_button").css("opacity", "0.9");
                item_sets_data[currently_item_set].title = $(".edit_text").val();

                $(".dropdown .options").empty();
                for (var i = 0; i < item_sets_data.length; i++){
                    $(".dropdown .options").append("<span index='"+i+"'>"+item_sets_data[i].title+"</span>");
                }
                $(".dropdown .selection").html(item_sets_data[currently_item_set].title);
                $("#save_button").attr("class", "save_button");
            }
        });

        if (!fs.existsSync(settings.lol_install_location)){
            loadPage("settings.html");
            $(".menu_bar_item").each(function(){
                $(this).removeAttr("selected");
            });
            $(this).attr("selected", "");
            alert("could not locate league of legends folder, Please go into settings and change the location");
        }
    }
});