//console.log('mediabin / app.js ');
var mediabinUI = function() {
    $("div#mediabin").height() < 1 ? $.cookie("cntmo_mediabin") ? $("div#mediabin").height("160px") : ($("div#mediabin").animate({
        height: "160px"
    }, 250, "easeOutBounce"), $.cookie("cntmo_mediabin", "open", {
        expires: 7,
        path: "/"
    })) : ($("div#mediabin").animate({
        height: "0px"
    }, 250, "swing"), $.cookie("cntmo_mediabin", "open", {
        expires: -1,
        path: "/"
    }))

};
