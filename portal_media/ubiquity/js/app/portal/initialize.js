//console.log('UBIQUITY / HS / APP / PORTAL / initialize'); 
$(document).ready(function() {
    if (gblPrtlIsAuthenticated) {
        var helppointer = '<div class="fld_help_txt_arrow">';
        $("#metadataform", "#main").delegate("li", "mouseenter mouseleave", function(e) {
            var $elHelp = $(this).find("div.fld_help_txt");
            "mouseenter" == e.type ? $($elHelp).siblings(".error").length < 2 && ($elHelp.append(helppointer), $elHelp.delay(250).addClass("fld_help_txt_show").animate({
                opacity: 1
            }, 250)) : $elHelp.css("opacity", "0").removeClass("fld_help_txt_show").find(".fld_help_txt_arrow").remove()
        }).delegate("input, select, textarea", "focusin focusout", function(e) {
            var $elHelp = $(this).parent("li").find("div.fld_help_txt");
            "focusin" == e.type ? $(this).hasClass("error") || ($elHelp.append(helppointer), $elHelp.addClass("fld_help_txt_show").animate({
                opacity: 1
            }, 250)) : $elHelp.css("opacity", "0").removeClass("fld_help_txt_show").find(".fld_help_txt_arrow").remove()
        }), void 0 !== window.$LAB && $LAB.script(gblStaticURL + "js/app/mediabin/collection.js").wait().script(gblStaticURL + "/ubiquity/js/app/mediabin/views.js").wait(function() {
            cntmo.app.page.mediaBinItems = new cntmo.prtl.MediaBin.MediaBinCollection, window.MediaBinItems = cntmo.app.page.mediaBinItems, !cntmo.app.page.mediaBin & $("#cntmo_prtl_mediabin_cnt_tmpl").length > 0 && (cntmo.app.page.mediaBin = new cntmo.prtl.MediaBin.MainView({
                countTemplate: _.template($("#cntmo_prtl_mediabin_cnt_tmpl").html()),
                collection: cntmo.app.page.mediaBinItems
            }), cntmo.prtl.MediaBinApp = cntmo.app.page.mediaBin), $(".mediabin-tab").click(function() {
                cntmo.app.page.mediaBin.toggle()
            })
        }), $(window).resize(function() {
            try {
                cntmo.app.page.mediaBinItems.trigger("resize")
            } catch (err) {}
            try {
                $("body .JqueryCentered").center()
            } catch (err) {}
        })
    }
    try {
        languageCode = $("html").attr("lang")
    } catch (err) {
        languageCode = "en"
    }
    "en" != languageCode && $.tools.dateinput.localize(languageCode, {
        months: gettext("January,February,March,April,May,June,July,August,September,October,November,December"),
        shortMonths: gettext("jan,feb,mar,apr,may,jun,jul,aug,sep,oct,nov,dec"),
        days: gettext("Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday"),
        shortDays: gettext("sun,mon,tue,wed,thu,fri,sat")
    }), SHORT_DATE_FORMAT = formats.SHORT_DATE_FORMAT.replace("d", "dd").replace("D", "ddd").replace("j", "d").replace("l", "dddd").replace("m", "mm").replace("M", "mmm").replace("n", "m").replace("N", "mmm.").replace("b", "mmm").replace("F", "mmmm").replace("y", "yy").replace("Y", "yyyy"), $("ul.level-one").supersubs({
        hoverClass: "sfHover",
        minWidth: 12,
        maxWidth: 29,
        extraWidth: 1
    }).superfish({
        speed: "fast"
    }), $("ul.plevel-one").supersubs({
        hoverClass: "sfHover",
        minWidth: 8,
        maxWidth: 29,
        extraWidth: 1
    }).superfish({
        speed: "fast"
    }), $(".successmessage", "#main").click(function() {
        $(this).fadeOut()
    }), $(".notice", "#main").click(function() {
        $(this).fadeOut()
    }), $(".errormessage", "#main").click(function() {
        $(this).fadeOut()
    }), $(document).bind("keydown", "alt+u", unfocusUI), $(document).bind("keydown", "alt+f", focusSearch), cntmo.utils.Retina.init(), $("#header .mediacontextualmenu").hover(function() {
        void 0 !== cntmo.app.timers.mediacontextmenu && clearTimeout(cntmo.app.timers.mediacontextmenu), $(this).addClass("mediacontextualmenu-hover").find("#mcm-dropdown").show()
    }, function() {
        var menu = this;
        cntmo.app.timers.mediacontextmenu = setTimeout(function() {
            $(menu).removeClass("mediacontextualmenu-hover").find("#mcm-dropdown").hide()
        }, 800)
    })
});
