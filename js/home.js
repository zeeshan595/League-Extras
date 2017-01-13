var fs = require('fs');

$(".content").bind("DOMNodeInserted", function(e){
    if ($(".content").attr("current_content") == "home.html" && $(e.target).attr("class") == "home"){
    }
});