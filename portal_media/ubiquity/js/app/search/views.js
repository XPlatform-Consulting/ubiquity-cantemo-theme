!function(prtl, $, undefined) {
    cntmo.prtl.Search = {
        
        parseSearchString: function(searchString) {
            return searchString
        },
        setupSearchResultsView: function(options) {
            $(".infocheckbox").attr("checked", !1), options.searchquery !== undefined && $.each("{{ searchquery }}".split(" "), function(idx, val) {
                $(".mediaitemtitle").highlight(val)
            })
        },
        SearchResultsView: Backbone.View.extend({
            tagName: "div",
            events: {
                "click .disabled a": "disableHandler",
                "click #show_advanced": "hideShowSearchAdvancedEvent",
                "click a.viewtypebutton": "viewTypeChange",
                "click #exportitem": "exportItems",
                "click #deleteitems": "deleteItems",
                "click #addtocollection": "addToCollection",
                "click #transcodeitems": "transcodeItems",
                "click #aclview": "aclView",
                "click #selectallitems": "selectAllItems",
                "click #selectallresults": "selectAllResults",
                "click #selectallcurrentpage": "selectAllCurrentPage",
                "click #deselectallcurrentpage": "deselectAllCurrentPage",
                "click #restoreitems": "restoreItems",
                "click a#savesearch": "saveSearch",
                "click .mediacontextualmenu #addtobinitems": "addToBin",
                "click .paginator a": "searchQuery",
                "click .search_ajax a": "searchQuery",
                "submit #searchform": "searchQuery",
                "click div.annotationtimeline": "showPodPreviewEventHandler",
                "click a.pod_preview": "showPodPreviewEventHandler",
                "click .display_podType": "setupIntervalType",
                "click .sortselector": "changeSortDirection",
                "change select.airdate": "changeSortField",
                "updatecount .mediaitem": "mediaItemChange"
            },
            initialize: function(options) {
                var self = this;
                _.bindAll(this, "startDraggable", "selectAllItems", "deselectSelectAll", "selectPrevious", "selectNext", "mediaItemChange", "enableAndDisableMenus", "disableHandler", "getItemPreviewInformation", "buildPodPreview", "bindAudioKeyBindings", "unBindAudioKeyBindings", "showPreview", "showPodPreviewEventHandler", "setupIntervalType", "cacheDOMElements"), this.views = {}, this.options = options || {}, this.search_adv_open = options.search_adv_open, this.search_adv_tog = options.search_adv_tog, this.library = options.library, this.library_selected = options.library_selected || undefined, this.search_id = options.search_id || undefined, this.search_id_selected = options.search_id_selected || undefined, this.is_collection = options.is_collection || !1, this.is_savedsearch = options.is_savedsearch || !1, this.message_strings = options.message_strings, this.collection = new cntmo.prtl.Search.SearchCollection, this.selected_collection = new cntmo.prtl.Search.SearchSelectedCollection, this.ignore_list = new cntmo.prtl.Search.SearchunSelectedCollection, this.preview_list = new cntmo.prtl.Search.PodPreviewCollection, this.preview_currentitem = undefined, this.preview_error = !1, cntmo.prtl.Search.setupSearchResultsView({
                    searchquery: options.searchquery || ""
                }), this.cacheDOMElements(), this.bindKeyBindings(), this.startSelectable(), this.startDraggable(), this.$el.find("ul.plevel-one").superfish("destroy").superfish({
                    speed: "fast"
                }), options.search_adv_tog || self.$el.find(".sa_placeholder").hide(), $("#show_advanced").length > 0 && $.get(updateQueryStringParameter($("#show_advanced").attr("rel"), "header", "False"), function(data) {
                    self.$el.find(".sa_placeholder").html(data)
                })
            },
            cacheDOMElements: function() {
                this.$firstvalEl = $("#first_on_page"), this.$lastvalEl = $("#last_on_page"), this.$hitstotalEl = $("#hits_total_results"), this.$viewtypebuttons = this.$el.find("a.viewtypebutton")
            },
            bindKeyBindings: function() {
                return $(document).bind("keydown", "ctrl+a", this.deselectSelectAll), $(document).bind("keydown", "shift+left", this.selectPrevious), $(document).bind("keydown", "shift+right", this.selectNext), $(document).bind("keydown", "left", this.selectPrevious), $(document).bind("keydown", "right", this.selectNext), $(document).bind("keydown", "space", this.showPodPreviewEventHandler), !0
            },
            unBindKeyBindings: function() {
                return $(document).off("keydown", this.deselectSelectAll), $(document).off("keydown", this.selectPrevious), $(document).off("keydown", this.selectNext), $(document).off("keydown", this.selectPrevious), $(document).off("keydown", this.selectNext), $(document).off("keydown", this.showPodPreviewEventHandler), !0
            },
            bindAudioKeyBindings: function() {
                return $(document).bind("keydown", "space", this.playpauseaudio), !0
            },
            unBindAudioKeyBindings: function() {
                return $(document).off("keydown", this.playpauseaudio), !0
            },
            playpauseaudio: function(event) {
                event.preventDefault(), event.stopImmediatePropagation(), cntmo.app.players.audioPlayer !== undefined && (cntmo.app.players.audioPlayer.paused ? cntmo.app.players.audioPlayer.play() : cntmo.app.players.audioPlayer.pause())
            },
            disableHandler: function(event) {
                return event.preventDefault(), event.stopImmediatePropagation(), !1
            },
            selectPrevious: function(event) {
                event.shiftKey || deselectAllItems();
                var $elToClick;
                if (cntmo.app.page.lastMediaItemClicked !== undefined) {
                    var $lastEl = $("#" + cntmo.app.page.lastMediaItemClicked);
                    $elToClick = $lastEl.prev(".mediaitem"), $elToClick.click()
                } else $elToClick = this.$el.find(".mediaitem:last"), $elToClick.click(), cntmo.app.page.lastMediaItemClicked = $elToClick.attr("id");
                $elToClick.isOnScreen("allOfIt") || $("html,body").animate({
                    scrollTop: $elToClick.offset().top
                })
            },
            selectNext: function(event) {
                event.shiftKey || deselectAllItems();
                var $elToClick;
                if (cntmo.app.page.lastMediaItemClicked !== undefined) {
                    var $lastEl = $("#" + cntmo.app.page.lastMediaItemClicked);
                    $elToClick = $lastEl.next(".mediaitem"), $elToClick.click()
                } else $elToClick = this.$el.find(".mediaitem:first"), $elToClick.click(), cntmo.app.page.lastMediaItemClicked = $elToClick.attr("id");
                $elToClick.isOnScreen("allOfIt") || $("html,body").animate({
                    scrollTop: $elToClick.offset().top
                })
            },
            startSelectable: function() {
                this.$el.find("#content").selectable("destroy").mousedown(function(event) {
                    return event.ctrlKey ? (event.stopImmediatePropagation(), !1) : void 0
                }).selectable({
                    delay: 100,
                    distance: 10,
                    filter: ".mediaitem",
                    selected: function(event, ui) {
                        $(ui.selected).click()
                    }
                })
            },
            startDraggable: function() {
                var self = this;
                this.$el.find(".mediaitem").draggable("destroy").mousedown(function(event) {
                    return event.ctrlKey ? (event.stopImmediatePropagation(), !1) : void 0
                }).draggable({
                    delay: 100,
                    filter: ".mediaitem",
                    helper: function() {
                        var $myEl = "",
                            $tempEl = "";
                        return self.selected_collection.length > 1 ? (self.selected_collection.each(function(item, index) {
                            2 > index && ($tempEl = $('<div style="position:absolute;">').append($("#" + item.get("id")).clone()), $tempEl.find(".mediaitemtitle").find("a").remove(), $tempEl.find(".thumbnailholder").find("a").remove(), $tempEl.find(".mediaitemduration").remove(), $tempEl.find(".podmenu_holder").remove(), $tempEl.find(".infoholder").remove(), $tempEl.css({
                                left: -2 + 8 * index + "px",
                                opacity: .4,
                                transform: "rotate(" + (-6 + 15 * index) + "deg)",
                                "-ms-transform": "rotate(" + (-6 + 15 * index) + "deg)",
                                "-webkit-transform": "rotate(" + (-6 + 15 * index) + "deg)"
                            }), $myEl += $("<div></div>").append($tempEl).html())
                        }), $myEl += $("<div>").append($(this).clone()).html()) : $myEl = $(this).clone(), $("<div style='position:absolute;'></div>").append($myEl)
                    },
                    start: function() {
                        self.getSelectedItemIds(!0).length > 1 && $(this).data({
                            selectedIDs: self.getSelectedItemIds(!0)
                        })
                    },
                    revert: !0,
                    zIndex: 100,
                    distance: 25,
                    revertDuration: 50
                })
            },
            deselectSelectAll: function() {
                this.library_selected = undefined, this.search_id_selected = undefined, this.$el.find(".selectedLibraryLabelChanges").each(function(index, el) {
                    $(el).html($(el).attr("noLibrarySelectedStateLabel"))
                }), this.ignore_list.reset(), deselectAllItems(event), selectAllItems(event)
            },
            selectAllCurrentPage: function(event) {
                event.preventDefault(), selectAllUnselectedItems(event)
            },
            deselectAllCurrentPage: function(event) {
                event.preventDefault(), deselectAllItems()
            },
            selectAllItems: function(event) {
                return event.preventDefault(), this.selected_collection && 0 == this.selected_collection.length ? selectAllItems(event) : (this.library_selected = undefined, this.search_id_selected = undefined, this.$el.find(".selectedLibraryLabelChanges").each(function(index, el) {
                    $(el).html($(el).attr("noLibrarySelectedStateLabel"))
                }), this.ignore_list.reset(), deselectAllItems(event), this.selected_collection.reset(), this.labelsSelectedChange(), this.updateCount()), !1
            },
            selectAllResults: function(event) {
                return event.preventDefault(), this.library_selected !== undefined || this.search_id_selected !== undefined ? (this.library_selected = undefined, this.search_id_selected = undefined, deselectAllItems(event), this.$el.find(".selectedLibraryLabelChanges").each(function(index, el) {
                    $(el).html($(el).attr("noLibrarySelectedStateLabel"))
                }), this.ignore_list.reset([]), this.selected_collection.reset([])) : (0 !== this.selected_collection.length && deselectAllItems(event), selectAllItems(event), this.$el.find(".selectedLibraryLabelChanges").each(function(index, el) {
                    $(el).html($(el).attr("librarySelectedStateLabel"))
                }), this.ignore_list.reset([]), this.selected_collection.reset([]), this.search_id ? this.search_id_selected = this.search_id : this.library_selected = this.library), this.labelsSelectedChange(), this.updateCount(), !1
            },
            getSelectedItemIds: function() {
                return this.selected_collection.pluck("id")
            },
            getIgnoredItemIds: function() {
                return this.ignore_list.pluck("id")
            },
            changeSortDirection: function(event) {
                var sortcookiename;
                sortcookiename = this.options.searchcollections ? "collectionsortdirection" : "itemsortdirection";
                var value;
                return value = $(event.target).hasClass("ascending") ? "descending" : "ascending", $.cookie(sortcookiename, value, {
                    path: "/"
                }), this.searchQuery(event)
            },
            changeSortField: function(event) {
                var sortcookiename;
                sortcookiename = this.options.searchcollections ? "collectionsortfield" : "itemsortfield";
                var value = $(event.target).val();
                return $.cookie(sortcookiename, value, {
                    path: "/"
                }), this.searchQuery(event)
            },
            searchFormSubmit: function() {
                return window.history && history.pushState ? !1 : ($("#searchinputbutton").on("click", function() {
                    $("#searchform input").each(function() {
                        var name = this.name;
                        if ("" === $(this).val()) {
                            var m = name.match("_0$");
                            if (m) {
                                var index = m.index,
                                    field_name = name.slice(0, index),
                                    type = $('input[name="' + field_name + '_1"]').val();
                                "date" !== type && "timestamp" !== type && $(this).parent().remove()
                            }
                        }
                    })
                }), void $(this).ajaxSubmit({
                    beforeSubmit: function() {
                        $("#loading-icon").fadeIn(500)
                    },
                    success: function() {
                        $("#loading-icon").fadeOut(300)
                    }
                }))
            },
            searchQuery: function(event) {
                var self = this;
                try {
                    delete sfoptions.url
                } catch (e) {}
                cntmo.app.page.searchresults.library_selected = undefined, cntmo.app.page.searchresults.search_id_selected = undefined, cntmo.app.page.searchresults.ignore_list.reset(), cntmo.app.page.searchresults.selected_collection.reset(), cntmo.app.page.searchresults.search_adv_open && cntmo.app.page.searchresults.hideShowSearchAdvanced($("#show_advanced")), cntmo.app.page.lastMediaItemClicked = undefined;
                var url = $(event.currentTarget).attr("href");
                this.options.sfoptions.url = url, event.preventDefault(), $(".sa_placeholder").hide(), $("#searchheader").data("closed") === undefined && ($("#searchform").animate({
                    "margin-left": 0
                }, "slow")
                .removeClass("JqueryCentered"),
                $("#searchheader").removeClass('fullscreen').data("closed", !0).css("position", "relative"));
                
                $("#header .mediacontextualmenu").show();
                $("#header .viewtypes").show();$("#searchinputfield").autocomplete("close");
                
                try {
                    $(event.currentTarget).attr("href") ? history.pushState(null, null, $(event.currentTarget).attr("href")) : history.pushState(null, null, "?" + $("#searchform").serialize())
                } catch (err) {}
                self.$viewtypebuttons.each(function() {
                    $(this).attr("href", window.location)
                }), $("<form/>").ajaxSubmit(self.options.sfoptions)
            },
            restoreItems: function(event) {
                var gorestore, formdata, self = this;
                event.preventDefault(), this.selected_collection.length > 0 ? gorestore = confirm(this.message_strings.restoreConfirm) : (gorestore = confirm(this.message_strings.restoreLibraryConfirm), gorestore && this.library_selected == undefined && (this.library_selected = this.library)), gorestore && (formdata = {
                    selected_objects: this.getSelectedItemIds(),
                    library_selected: this.library_selected,
                    ignore_list: this.getIgnoredItemIds()
                }, $.ajax({
                    type: "POST",
                    url: self.options.definedurls.restore_items_url,
                    data: formdata,
                    traditional: !0,
                    success: function(responseText) {
                        var items_to_remove = [];
                        self.library_selected ? items_to_remove = self.getSelectedItemsOnCurrentPage() : self.selected_collection.each(function() {
                            items_to_remove = self.selected_collection.toArray()
                        }), $(items_to_remove).each(function(index, item) {
                            if (!self.ignore_list.findWhere({
                                id: item.id
                            })) {
                                $.publish("/cntmo/prtl/item/restore", [item.id, "restore"]), self.$el.find("#" + item.id).fadeOut("slow", function() {
                                    $(this).remove(), self.updateCount()
                                });
                                try {
                                    lastval = parseInt(self.$lastvalEl.html(), 10), hits_total_results = parseInt(self.$hitstotalEl.html(), 10), self.$hitstotalEl.html(hits_total_results - 1), self.$lastvalEl.html(lastval - 1)
                                } catch (e) {}
                            }
                        }), self.selected_collection.reset([]), self.ignore_list.reset([]), self.library_selected = undefined, $.growl(responseText.success, "success")
                    },
                    error: function() {
                        $.growl(self.message_strings.restoreError, "error")
                    }
                }))
            },
            saveSearch: function(event) {
                event.preventDefault();
                var self = this,
                    $targetEl = $(event.target) || $(event.srcElement),
                    standardOptions = {
                        width: 600,
                        modal: !0,
                        resizable: !1,
                        dialogClass: "savesearch",
                        title: $targetEl.html(),
                        buttons: [{
                            text: gettext("Save"),
                            click: function() {
                                $("#savedsearch_add_form").submit()
                            },
                            "class": "save-savesearch ui-dialog-button-confirm"
                        }, {
                            text: gettext("Cancel"),
                            click: function() {
                                $(".ui-dialog-content").dialog("close").remove()
                            },
                            "class": "cancel-savesearch ui-dialog-button-cancel"
                        }]
                    };
                self.$dialogEl = $("<div></div>"), self.$dialogEl.load($targetEl.attr("href")).dialog(standardOptions)
            },
            deleteItems: function(event) {
                var ok_counter, self = this;
                event.preventDefault(), ok_counter = this.selected_collection.length > 0 ? self.selected_collection.length : self.$hitstotalEl.text(), standardOptions = {
                    width: 600,
                    modal: !0,
                    resizable: !1,
                    dialogClass: "savesearch",
                    title: "Delete confirmation",
                    buttons: [{
                        text: gettext("Delete") + " " + ok_counter + " " + gettext("items"),
                        click: function() {
                            self.actualDelete()
                        },
                        "class": "ui-dialog-button-confirm"
                    }, {
                        text: gettext("Cancel"),
                        click: function() {
                            $(".ui-dialog-content").dialog("close").remove()
                        },
                        "class": "ui-dialog-button-cancel"
                    }]
                }, self.$dialogEl = $("<div></div>"), this.selected_collection.length > 0 ? self.$dialogEl.html(this.message_strings.deleteConfirm).dialog(standardOptions) : self.$dialogEl.html(this.message_strings.deleteLibraryConfirm).dialog(standardOptions)
            },
            actualDelete: function() {
                var self = this,
                    formdata = {
                        selected_objects: this.getSelectedItemIds(),
                        library_selected: this.library_selected,
                        search_id_selected: this.search_id_selected,
                        ignore_list: this.getIgnoredItemIds(),
                        collection: this.is_collection
                    };
                self.options.eager_delete !== undefined && self.options.eager_delete === !0 && (formdata.eager_delete = !0), $.ajax({
                    type: "POST",
                    url: self.options.definedurls.delete_item_url,
                    data: formdata,
                    traditional: !0,
                    success: function(responseText) {
                        var items_to_remove = [];
                        self.library_selected ? items_to_remove = self.getSelectedItemsOnCurrentPage() : self.selected_collection.each(function() {
                            items_to_remove = self.selected_collection.toArray()
                        }), $(items_to_remove).each(function(index, item) {
                            if (!self.ignore_list.findWhere({
                                id: item.id
                            })) {
                                $.publish("/cntmo/prtl/item/delete", [item.id, "delete"]), self.$el.find("#" + item.id).fadeOut("slow", function() {
                                    $(this).remove(), self.updateCount()
                                });
                                try {
                                    lastval = parseInt(self.$lastvalEl.html(), 10), hits_total_results = parseInt(self.$hitstotalEl.html(), 10), self.$hitstotalEl.html(hits_total_results - 1), self.$lastvalEl.html(lastval - 1)
                                } catch (e) {}
                            }
                        }), self.selected_collection.reset([]), self.ignore_list.reset([]), self.library_selected = undefined, $.growl(responseText.success, "success")
                    },
                    error: function() {
                        $.growl(self.message_strings.deleteError, "error")
                    }
                }), $(".ui-dialog-content").dialog("close").remove()
            },
            exportItems: function(event) {
                event.preventDefault();
                var fbas, self = this,
                    chckBoxStr = "",
                    standardOptions = {};
                this.selected_collection.length > 0 ? (this.selected_collection.each(function(item) {
                    chckBoxStr += "selected_objects=" + item.id + "&"
                }), fbas = this.options.definedurls.exporturl + "?" + chckBoxStr) : fbas = this.options.definedurls.exportallurl, standardOptions = {
                    width: 600,
                    modal: !0,
                    resizable: !1,
                    dialogClass: "exportView",
                    title: gettext("Export"),
                    show: {
                        effect: "fade",
                        duration: 300
                    },
                    hide: {
                        effect: "fade",
                        duration: 300
                    },
                    buttons: [{
                        text: gettext("Export"),
                        click: function() {
                            $("#export_ajax_form").submit()
                        },
                        "class": "send-export-button ui-dialog-button-confirm"
                    }, {
                        text: gettext("Close"),
                        click: function() {
                            $(this).dialog("close")
                        },
                        "class": "cancel-export-button ui-dialog-button-cancel"
                    }]
                }, self.$dialogEl = $("<div></div>"), self.$dialogEl.load(fbas).dialog(standardOptions)
            },
            addToBin: function(event) {
                event && event.preventDefault();
                var prevErr, self = this,
                    addLibraryPass = !0,
                    errors = [];
                (self.library_selected !== undefined || self.search_id_selected !== undefined) && (addLibraryPass = confirm(gettext("We dont allow complete search results to be added, do you want to add all the highlighted items to your bin?"))),
                        cntmo.app.page.mediaBinItems !== undefined && addLibraryPass && (0 === self.getSelectedItemIds().length && self.library_selected === undefined && self.search_id_selected === undefined && self.selectAllItems(event), _.each(self.getSelectedItemIds(), function(itemid) {
                        var $elItem = self.$el.find("#" + itemid);
                        if (cntmo.app.page.mediaBinItems.isInBin($elItem.attr("id")) === !1) try {
                            cntmo.app.page.mediaBinItems.create({
                                resource_id: $elItem.attr("id"),
                                resource_name: $elItem.find(".mediaitemtitle a").html(),
                                thumbnail_uri: $elItem.find("img.mediathumb").attr("src"),
                                resource_type: $elItem.find("img.media_type").attr("alt")
                            }, {
                                error: function() {
                                    errors.push(gettext("Could not add to bin item: ") + $elItem.attr("id"))
                                }
                            })
                        } catch (err) {
                            errors.push(err)
                        } else errors.push(gettext("Item already in MediaBin"))
                    }), errors.length > 0 ? _.each(errors, function(err) {
                        prevErr != err && ($.growl(err), prevErr = err)
                    }) : ($.publish("/cntmo/prtl/MediaBin/finishedAdding"), $.growl(gettext("Added to MediaBin"), "success")))
            },
            aclView: function(event) {
                event && event.preventDefault();
                standardOptions = {
                    width: 600,
                    modal: !0,
                    resizable: !1,
                    dialogClass: "aclView",
                    title: gettext("Access Control List"),
                    show: {
                        effect: "fade",
                        duration: 500
                    },
                    hide: {
                        effect: "fade",
                        duration: 500
                    },
                    buttons: [{
                        text: gettext("Close"),
                        click: function() {
                            $(this).dialog("close")
                        },
                        "class": "close-acl-button ui-dialog-button-confirm"
                    }]
                }, $("#acltable").dialog(standardOptions)
            },
            addToCollection: function(event) {
                event && event.preventDefault();
                var title, self = this,
                    showDialog = function() {
                        0 === self.getSelectedItemIds().length && self.library_selected === undefined && self.search_id_selected == undefined ? (self.selectAllItems(event), title = gettext("Add All to Collection")) : title = self.library_selected !== undefined || self.search_id_selected != undefined ? gettext("Add All Results to Collection") : self.message_strings.collectionaddbutton || gettext("Add Selected Items to Collection"), self.views.addToCollectionView = new cntmo.prtl.Collection.addToCollection({
                            collectionaddbuttontext: self.message_strings.collectionaddbutton || gettext("Add To Collection"),
                            collectioncancelbuttontext: self.message_strings.collectioncancelbutton || gettext("Cancel"),
                            title: title,
                            selected_objects: self.getSelectedItemIds(),
                            library_selected: self.library_selected,
                            search_id_selected: self.search_id_selected,
                            ignore_list: self.getIgnoredItemIds(),
                            from_collection: self.options.is_collection
                        })
                    };
                $LAB.script(cntmo.loadLocations.addToCollection).wait(function() {
                    showDialog()
                })
            },
            transcodeItems: function(event) {
                event.preventDefault();
                var self = this,
                    standardOptions = {
                        width: 600,
                        modal: !0,
                        resizable: !1,
                        dialogClass: "transcodeView",
                        title: gettext("Transcode Items"),
                        show: {
                            effect: "fade",
                            duration: 300
                        },
                        hide: {
                            effect: "fade",
                            duration: 300
                        },
                        close: function() {
                            $(this).dialog("destroy").remove()
                        },
                        buttons: [{
                            text: gettext("Transcode"),
                            click: function() {
                                $("#transcode_ajax_form").submit()
                            },
                            "class": "send-transcode-button ui-dialog-button-confirm"
                        }, {
                            text: gettext("Cancel"),
                            click: function() {
                                $(".ui-dialog-content").dialog("close")
                            },
                            "class": "cancel-transcode-button ui-dialog-button-cancel"
                        }]
                    };
                self.$dialogEl = $("<div></div>"), self.$dialogEl.load($(event.currentTarget).attr("rel")).dialog(standardOptions)
            },
            hideShowSearchAdvancedEvent: function(event) {
                var $showAdvancedElement = $(event.target) || $(event.srcElement),
                    self = this;
                self.hideShowSearchAdvanced($showAdvancedElement)
            },
            hideShowSearchAdvanced: function($showAdvancedElement) {
                var beforeText = $showAdvancedElement.attr("beforeText"),
                    afterText = $showAdvancedElement.attr("afterText");
                this.search_adv_open === !0 ? (this.$el.find(".sa_placeholder").hide(), $showAdvancedElement.html(beforeText), this.search_adv_open = !1) : (this.search_adv_tog !== !0, this.$el.find(".sa_placeholder").show(), this.search_adv_open = !0, $showAdvancedElement.html(afterText))
            },
            viewTypeChange: function(event) {
                return event.preventDefault(), $.cookie("search_results_viewtype", $(event.target).attr("refs"), {
                    path: "/"
                }), this.searchQuery(event)
            },
            mediaItemChange: function(event) {
                var self = this,
                    itemID = event.target.id,
                    itemType = $(event.target).attr("data-itemtype"),
                    itemWasSelected = !1;
                this.getSelectedItemsOnCurrentPage().filter("#" + itemID).length > 0 && (itemWasSelected = !0), this.library_selected !== undefined || this.search_id_selected !== undefined ? itemWasSelected ? this.ignore_list.remove({
                    id: itemID
                }) : this.ignore_list.add({
                    id: itemID,
                    resource_type: itemType
                }) : itemWasSelected ? (this.ignore_list.get(itemID) && this.ignore_list.remove(itemID), self.selected_collection.get(itemID) || this.selected_collection.add({
                    id: itemID,
                    resource_type: itemType
                })) : this.selected_collection.remove(itemID), this.labelsSelectedChange(), this.updateCount()
            },
            updateCount: function() {
                var self = this;
                self.library_selected !== undefined || self.search_id_selected !== undefined ? self.$el.find(".selectioncount").html(self.ignore_list.length > 0 ? gettext("All except") + " " + self.ignore_list.length : self.$hitstotalEl.text()) : self.selected_collection.length > 0 ? self.$el.find(".selectioncount").html(self.selected_collection.length) : (self.$el.find(".selectioncount").html(""), self.$el.find("#selectionmsg").html(self.$el.find("#selectionmsg").attr("noitemsselectedstatelabel"))), this.enableAndDisableMenus()
            },
            labelsSelectedChange: function() {
                var elements = this.$el.find(".selectedStateLabelChanges");
                this.selected_collection.length > 0 || this.library_selected !== undefined || this.search_id_selected !== undefined ? $.each(elements, function(index, el) {
                    $(el).html($(el).attr("itemsselectedstatelabel"))
                }) : $.each(elements, function(index, el) {
                    $(el).html($(el).attr("noitemsselectedstatelabel"))
                })
            },
            enableAndDisableMenus: function() {
                var actionsEnabled = !1,
                    selectCurrentEnabled = !1,
                    deselectCurrentEnabled = !1,
                    selectedOnCurrentPage = this.getSelectedItemsOnCurrentPage(),
                    allOnCurrentPage = this.getAllItemsOnCurrentPage();
                (this.library_selected !== undefined || this.search_id_selected !== undefined) && (actionsEnabled = !0), this.selected_collection.length > 0 && (actionsEnabled = !0), selectedOnCurrentPage.length > 0 && (actionsEnabled = !0, deselectCurrentEnabled = !0), selectedOnCurrentPage.length < allOnCurrentPage.length && (selectCurrentEnabled = !0), actionsEnabled ? this.$el.find(".actions").removeClass("disabled") : this.$el.find(".actions").addClass("disabled"), selectCurrentEnabled ? this.$el.find("#selectallcurrentpage").removeClass("disabled") : this.$el.find("#selectallcurrentpage").addClass("disabled"), deselectCurrentEnabled ? this.$el.find("#deselectallcurrentpage").removeClass("disabled") : this.$el.find("#deselectallcurrentpage").addClass("disabled")
            },
            getAllItemsOnCurrentPage: function() {
                return this.$el.find(".mediaitem")
            },
            getSelectedItemsOnCurrentPage: function() {
                return this.$el.find(".mediaitem.mediaitem-selected")
            },
            parseNewPage: function() {
                var self = this;
                this.library_selected !== undefined || this.search_id_selected !== undefined ? this.$el.find(".mediaitem").each(function(index, item) {
                    self.ignore_list.findWhere({
                        id: item.id
                    }) || (self.selected_collection.remove(self.selected_collection.get(item.id)), $(item).click())
                }) : this.selected_collection.length > 0 && this.$el.find(".mediaitem").each(function(index, item) {
                    self.selected_collection.findWhere({
                        id: item.id
                    }) && (self.selected_collection.remove(self.selected_collection.get(item.id)), $(item).click())
                }), this.startDraggable(), this.updateCount()
            },
            showPodPreviewEventHandler: function(event) {
                var itemID, podURL, title, relstarttimecode, relendtimecode, self = this;
                if (event && (event.preventDefault(), event.stopPropagation()), event && event.currentTarget.hasAttribute !== undefined && event.currentTarget.hasAttribute("data-podpreviewurl")) podURL = $(event.currentTarget).attr("data-podpreviewurl"), "SubClip" === $(event.target).attr("data-itemtype") ? (podURL += "?SubClip=" + $(event.target).attr("id"), itemID = $(event.currentTarget).attr("data-parentitem")) : itemID = $(event.currentTarget).attr("rel"), title = $(event.currentTarget).attr("title"), relstarttimecode = $(event.currentTarget).attr("data-relstarttimecode"), relendtimecode = $(event.currentTarget).attr("data-relendtimecode");
                else if (cntmo.app.page.searchresults.selected_collection.length > 0) item = cntmo.app.page.searchresults.selected_collection.last(), itemDomObject = $("#" + item.get("id") + ".mediaitem"), podURL = itemDomObject.attr("data-podpreviewurl"), "SubClip" === item.get("resource_type") ? itemID = itemDomObject.attr("data-parentitem") : (itemID = item.get("id"), podURL += "?SubClip"), title = itemDomObject.find(".mediaitemtitle a").text(), relstarttimecode = itemDomObject.attr("data-relstarttimecode"), relendtimecode = itemDomObject.attr("data-relendtimecode");
                else if (this.$el.find(".mediaitem.mediaitemsubclip.mediaitem-selected").length > 0) itemID = $(this.$el.find(".mediaitem.mediaitemsubclip.mediaitem-selected")[0]).attr("data-parentitem"), title = $(this.$el.find(".mediaitem.mediaitemsubclip.mediaitem-selected")[0]).find(".mediaitemtitle a").text(), podURL = $(this.$el.find(".mediaitem.mediaitemsubclip.mediaitem-selected")[0]).attr("data-podpreviewurl") + "?SubClip=", podURL += $(this.$el.find(".mediaitem.mediaitemsubclip.mediaitem-selected")[0]).attr("id"), relstarttimecode = $(this.$el.find(".mediaitem.mediaitemsubclip.mediaitem-selected")[0]).attr("data-relstarttimecode"), relendtimecode = $(this.$el.find(".mediaitem.mediaitemsubclip.mediaitem-selected")[0]).attr("data-relendtimecode");
                else {
                    if (event.currentTarget.hasAttribute === undefined || !event.currentTarget.hasAttribute("data-podpreviewurl")) return !1;
                    itemID = $(event.currentTarget).attr("data-parentitem"), title = $(event.currentTarget).attr("data-title"), podURL = $(event.currentTarget).attr("data-podpreviewurl") + "?SubClip=", podURL += $(event.currentTarget).attr("id"), relstarttimecode = $(event.currentTarget).attr("data-relstarttimecode"), relendtimecode = $(event.currentTarget).attr("data-relendtimecode")
                }
                return self.getItemPreviewInformation(itemID, relstarttimecode, relendtimecode), self.buildPodPreview(itemID, podURL, title), !0
            },
            buildPodPreview: function(itemID, podURL, title) {
                var self = this;
                if (self.canusepreview === undefined) {
                    var testVideoElement = document.createElement("video");
                    self.canusepreview = testVideoElement.canPlayType !== undefined
                }
                self.canusepreview ? $LAB.script(cntmo.loadLocations.captionator).script(cntmo.loadLocations.player).wait(function() {
                    $.ajax({
                        url: podURL,
                        success: function(data) {
                            self.podPreview = $('<div class="podPreview">').html(data).dialog({
                                modal: !0,
                                title: title,
                                draggable: !1,
                                resizable: !1,
                                width: 910,
                                dialogClass: "ui-dialog-podpreview",
                                open: function(event) {
                                    $(".ui-widget-overlay").addClass("ui-widget-overlay-podpreview").on("click", function() {
                                        self.podPreview.dialog("close")
                                    }), self.unBindKeyBindings(), self.showPreview();
                                    $(event.target).find("nav.tabs ul").tabs("section.panes", {
                                        initialIndex: parseInt($(event.target).find("nav.tabs").attr("data-tabIndex"), 10)
                                    });
                                    $(event.target).parent().find(".ui-dialog-title").on("click", function() {
                                        window.location.href = "/vs/item/" + self.preview_currentitem.get("id") + "/"
                                    })
                                },
                                beforeClose: function() {
                                    if (cntmo.app.players.mainPlayer !== undefined) try {
                                        cntmo.app.players.mainPlayer.pause(), cntmo.app.players.mainPlayer.timeline.timeline.length > 0 && _.each(cntmo.app.players.mainPlayer.timeline.timeline, function() {
                                            cntmo.app.players.mainPlayer.removeFromTimeline(0)
                                        })
                                    } catch (error) {} finally {
                                        cntmo.app.players.mainPlayer.disableHotkeys()
                                    }
                                    return $("#player").hide().insertBefore("#mediabin"), $(".podPreviewImage").remove(), self.bindKeyBindings(), self.unBindAudioKeyBindings(), $("body").css({
                                        overflow: "inherit"
                                    }), !0
                                },
                                create: function() {
                                    $("body").css({
                                        overflow: "hidden"
                                    })
                                },
                                close: function() {
                                    self.preview_error = !1, self.preview_currentitem = undefined, self.podPreview !== undefined && self.podPreview.remove(), delete self.podPreview
                                }
                            })
                        },
                        error: function() {
                            $.growl(gettext("Could not open preview"), "error")
                        }
                    })
                }) : $.growl(gettext("Please upgrade your browser"), "error")
            },
            getItemPreviewInformation: function(itemID, starttimecode, endtimecode) {
                var self = this,
                    model = new cntmo.vs.VSItem({
                        resource_uri: self.options.definedurls.item_api + itemID + "/"
                    });
                return model.fetch({
                    success: function() {
                        starttimecode !== undefined && endtimecode !== undefined && (startTC = new Timecode({
                            smpte: starttimecode
                        }), endTC = new Timecode({
                            smpte: endtimecode
                        }), mediaStartTC = model.get("start_tc"), duration = endTC.minus(startTC), model.set({
                            start_tc: starttimecode,
                            duration: duration.toSMPTE(),
                            mediaStartTC: mediaStartTC
                        })), "sequence" === model.get("resource_type") && self.getSequenceInformation(model), self.preview_currentitem = model
                    },
                    error: function() {
                        $.growl(gettext("Error getting item information"), "error"), self.preview_error = !0
                    }
                }), !0
            },
            getSequenceInformation: function(model) {
                var self = this,
                    SeqCollection = Backbone.Collection.extend({
                        model: cntmo.vs.VSItem,
                        url: self.options.definedurls.sequence_api + model.get("id") + "/",
                        parse: function(response) {
                            return response.sequence_elements
                        }
                    }),
                    collection = new SeqCollection;
                return collection.fetch({
                    success: function() {
                        collection.done = !0, collection.each(function(mod) {
                            $.ajax({
                                url: self.options.definedurls.item_api + mod.get("id") + "/",
                                success: function(responseText) {
                                    mod.set({
                                        browse_urls: responseText.browse_urls
                                    })
                                }
                            })
                        })
                    }
                }), model.set({
                    collection: collection
                }), !0
            },
            showPreview: function() {
                var inpoint, outpoint, duration, self = this,
                    preview = undefined;
                if (self.preview_currentitem !== undefined && $("#playerwrapper").length > 0) {
                    var getPreview = function(element) {
                        return preview = -1 !== navigator.userAgent.search("Firefox") ? _.find(element.get("browse_urls"), function(v) {
                            return "video/webm" == v.file_type
                        }) : _.find(element.get("browse_urls"), function(v) {
                            return "video/mp4" == v.file_type
                        }), preview !== undefined ? preview.url : undefined
                    };
                    if ("video" == self.preview_currentitem.get("resource_type")) getPreview(self.preview_currentitem) !== undefined ? (self.setOrGetPreviewPlayer(), cntmo.app.players.mainPlayer.addToTimeline(0, {
                        url: getPreview(self.preview_currentitem),
                        startTC: self.preview_currentitem.get("start_tc"),
                        mediaStartTC: self.preview_currentitem.get("mediaStartTC") || self.preview_currentitem.get("start_tc"),
                        frameRateNumerator: self.preview_currentitem.get("framerate_numerator"),
                        frameRateDenominator: self.preview_currentitem.get("framerate_denominator"),
                        durationTC: self.preview_currentitem.get("duration")
                    }), cntmo.app.players.mainPlayer.setTimelineStartTC(self.preview_currentitem.get("start_tc")), $("#player").appendTo("#playerwrapper").show(), cntmo.app.players.mainPlayer.enableHotkeys(), cntmo.app.players.mainPlayer.play()) : $.growl(gettext("Could not find a proper file to show preview"), "error");
                    else if ("audio" == self.preview_currentitem.get("resource_type")) {
                        preview = _.find(self.preview_currentitem.get("browse_urls"), function(v) {
                            return "audio/mpeg" == v.file_type
                        });
                        var $audioplayer = $('<div class="player"><div class="audioplayer" id="audioplayerwrapper" style="width:635px;height:432px;"><audio style="height:432px;width:635px" id="audioplayer" class="player" controls></div></div>');
                        $audioplayer.appendTo("#playerwrapper"), cntmo.app.players.audioPlayer = document.getElementById("audioplayer"), cntmo.app.players.audioPlayer.src = preview.url, cntmo.app.players.audioPlayer.play(), null !== self.preview_currentitem.get("representative_thumbnail") && $("#audioplayerwrapper").css({
                            "background-image": "url(" + self.preview_currentitem.get("representative_thumbnail") + ")"
                        }), self.bindAudioKeyBindings()
                    } else if ("image" == self.preview_currentitem.get("resource_type"))
                        if (preview = _.find(self.preview_currentitem.get("browse_urls"), function(v) {
                            return "image/jpeg" == v.file_type
                        }), self.podPreview && self.podPreview.find(".podPreviewImage").length > 0) self.podPreview.find(".podPreviewImage").attr({
                            src: preview.url
                        });
                        else {
                            var $imagepreview = $('<img src="' + preview.url + '" class="podPreviewImage">');
                            $imagepreview.appendTo("section.preview")
                        } else if ("sequence" == self.preview_currentitem.get("resource_type"))
                        if (self.setOrGetPreviewPlayer(), self.preview_currentitem.get("collection").done !== !0) setTimeout(self.showPreview, 50);
                        else {
                            var scl = self.preview_currentitem.get("collection").length;
                            self.preview_currentitem.get("collection").at(scl - 1).has("browse_urls") === !1 ? setTimeout(self.showPreview, 50) : self.preview_currentitem.get("collection").each(function(element, index, list) {
                                inpoint = Timecode({
                                    smpte: element.get("inpoint"),
                                    fps: element.get("fps")
                                }), outpoint = Timecode({
                                    smpte: element.get("outpoint"),
                                    fps: element.get("fps")
                                }), duration = outpoint.minus(inpoint), cntmo.app.players.mainPlayer.addToTimeline(index, {
                                    url: getPreview(element),
                                    startTC: inpoint.toSMPTE(),
                                    mediaStartTC: inpoint.toSMPTE(),
                                    durationTC: duration.toSMPTE()
                                }), list.length - 1 === index && (cntmo.app.players.mainPlayer.setTimelineStartTC(self.preview_currentitem.get("start_tc")), $("#player").appendTo("#playerwrapper").show(), cntmo.app.players.mainPlayer.enableHotkeys(), cntmo.app.players.mainPlayer.play(), cntmo.app.players.mainPlayer.setCurrentTC(self.preview_currentitem.get("start_tc")))
                            })
                        } else $.growl(gettext("Could not find a proper file to show preview"), "error")
                } else self.preview_error === !1 && setTimeout(self.showPreview, 50)
            },
            setOrGetPreviewPlayer: function() {
                if (cntmo.app.players.mainPlayer === undefined) {
                    var $player = $('<div id="player" class="player">');
                    $player.appendTo("#playerwrapper"), cntmo.app.players.mainPlayer = new PleroVideoPlayer($player, {
                        dimensionClass: "largePlayer",
                        hotkeys: !0,
                        timeline: [],
                        startTC: "00:00:00:00",
                        onerror: function(msg) {
                            $.growl(gettext("There was an error starting the viewerplayer: ") + msg, "error")
                        }
                    }), $(cntmo.app.players.mainPlayer).off().on("timeline:canplay", function() {
                        cntmo.app.players.mainPlayer.play()
                    })
                } else cntmo.app.players.mainPlayer.timeline.timeline.length > 0 && _.each(cntmo.app.players.mainPlayer.timeline.timeline, function(entry, index) {
                    cntmo.app.players.mainPlayer.removeFromTimeline(index)
                });
                return !0
            },
            setupIntervalType: function() {
                return !0
            }
        })
    }
}(cntmo.prtl = cntmo.prtl || {}, jQuery);
