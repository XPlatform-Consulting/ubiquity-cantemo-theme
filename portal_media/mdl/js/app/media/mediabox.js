$(function() {
    selectAllItems = function(e) {
        e && (e.stopPropagation(), e.preventDefault()), $(".mediaitem").click()
    }, deselectAllItems = function(e) {
        e && (e.stopPropagation(), e.preventDefault()), $(".infocheckbox:checked").parents(".mediaitem").click()
    }, selectAllUnselectedItems = function(event) {
        event && (event.stopPropagation(), event.preventDefault()), $(".mediaitem").each(function() {
            $(this).hasClass("mediaitem-selected") || $(this).click()
        })
    }, $(document).on("mouseenter mouseleave", ".mediaitem", function() {
        $(this).addClass("mediaitem-active")
    }, function() {
        $(this).removeClass("mediaitem-active")
    }),
    $(document).on("click", ".mediaitem", function(event) {
        $("#searchinputfield").blur();
        var selectType, input = $(this).find("input");
        if (input.is(":checked") ? ($(this).trigger("unselectitem"), selectType = "unselectitem") : (selectType = "selectitem", $(this).trigger("selectitem")), event.shiftKey && void 0 !== cntmo.app.page.lastMediaItemClicked) {
            var lastEl = "#" + cntmo.app.page.lastMediaItemClicked;
            0 !== $(this).prevAll(lastEl).length ? $(this).prevUntil(lastEl).trigger(selectType) : 0 !== $(this).nextAll(lastEl).length && $(this).nextUntil(lastEl).trigger(selectType)
        }
        cntmo.app.page.lastMediaItemClicked = $(this).attr("id")
    }), $(document).on("selectitem", ".mediaitem", function() {
        $(this).addClass("mediaitem-selected");
        var input = $(this).find("input");
        input.is(":checked") || input.prop("checked", !0), $(this).trigger("updatecount")
    }), $(document).on("unselectitem", ".mediaitem", function() {
        $(this).removeClass("mediaitem-selected");
        var input = $(this).find("input");
        input.is(":checked") && input.prop("checked", !1), $(this).trigger("updatecount")
    }), $(".mediaitem").draggable("destroy").draggable({
        delay: 100,
        helper: "clone",
        revert: !0,
        zIndex: 100,
        distance: 25,
        revertDuration: 50
    }), $(document).on("click", ".podmenu_holder a.add_to_collection", function(event) {
        event.preventDefault(), event.stopPropagation();
        var ID = $(this).parents(".mediaitem").attr("id");
        $LAB.script(cntmo.loadLocations.addToCollection).wait(function() {
            new cntmo.prtl.Collection.addToCollection({
                collectionaddbuttontext: gettext("Add To Collection"),
                collectioncancelbuttontext: gettext("Cancel"),
                title: gettext("Add Item to Collection"),
                selected_objects: [ID],
                library_selected: void 0,
                ignore_list: []
            })
        })
    }), $(document).on("click", ".podmenu_holder a.deleteitem", function(e) {
        $(this).parents(".mediaitem").trigger("click"), deleteItems(e)
    }),
    $(document).on("click", "a.mdl-menu__item.add_to_bin", function(event) {
        var $elMediaItem = $(this).parents(".mediaitem"),
            errors = [];
        if (cntmo.app.page.mediaBinItems.isInBin($elMediaItem.attr("id")) === !1) try {
            cntmo.app.page.mediaBinItems.create({
                resource_id: $elMediaItem.attr("id"),
                resource_name: $elMediaItem.find(".mdl-card__title .mdl-card__title-text").html(),
                thumbnail_uri: $elMediaItem.find("img.mediathumb").attr("src"),
                resource_type: $elMediaItem.data("itemtype")
            }, {
                error: function() {
                    errors.push(gettext("Could not add item to bin"))
                }
            })
        } catch (err) {
            errors.push(err)
        } else errors.push(gettext("Item already in MediaBin"));
        if (errors.length > 0) {
            var prevErr = "";
            _.each(errors, function(err) {
                prevErr != err && ($.growl(err), prevErr = err)
            })
        } else $.publish("/cntmo/prtl/MediaBin/finishedAdding"), $.growl(gettext("Added to MediaBin"), "success");
        $(this).trigger("updatecount");
    }), $(document).on("click", ".smallgriditem", function() {
        $(this).toggleClass("smallgriditem-selected").find(".smallgriditem-plus").toggleClass("smallgriditem-plus-selected"), $(this).removeClass("mediaitem-active").find(".smallgriditem-plus").removeClass("smallgriditem-plus-active"), $(this).hasClass("smallgriditem-selected") || ($(this).find(".sitdd-multi").hide(), $(this).find(".sitdd-single").show()), input = $(this).find("input"), input.attr("checked") ? input.attr("checked", !1) : input.attr("checked", !0), $(this).trigger("updatecount")
    }), $(".mediabox-deleteslctd").click(function(e) {
        e.preventDefault(), e.stopPropagation();
        var slcted = [];
        $.each($(".mediabox-selected"), function(index, value) {
            slcted.push(value.id)
        }), $.ajax({
            type: "POST",
            url: url_delete_items,
            traditional: !0,
            data: {
                selected_objects: slcted
            },
            success: function() {
                $.each(slcted, function(index, value) {
                    $("#" + value).remove()
                }), $.growl(gettext("Successfully deleted"), "success")
            },
            error: function() {
                $.growl(gettext("Failed to delete"), "error")
            }
        })
    }), $(document).on("click", "#mediabox-selectall", function() {
        var input = $(this).find("input");
        input.attr("checked", !0), $(".mediabox").addClass("mediabox-selected").find(".mediabox-plus").addClass("mediabox-plus-selected")
    }), $(document).on("click", "#mediabox-deselectall", function() {
        var input = $(this).find("input");
        input.attr("checked", !1), $(".mediabox").removeClass("mediabox-selected").find(".mediabox-plus").removeClass("mediabox-plus-selected")
    })
});
