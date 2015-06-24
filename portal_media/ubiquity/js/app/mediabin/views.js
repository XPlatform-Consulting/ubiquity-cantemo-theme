! function(MediaBin, $, undefined) {
    MediaBin.MediaBinVSItemView = Backbone.View.extend({
        tagName: "div",
        className: "smallmediapod",
        events: {
            click: "clickHandler",
            dragstop: "dragHandler",
            "click .cntmo_prtl_mediabin-pod-rmv": "removeItem",
            "cntmo.prtl.MediaBinVSItemView.addContextPlugin": "addContextPlugin"
        },
        initialize: function(attributes) {
            this.model = attributes.model, this.template = attributes.template, this.ui_select = attributes.ui_select === undefined ? !0 : attributes.ui_select, _.bindAll(this, "render", "clickHandler"), this.model.bind("change", this.render), this.model.view = this, this.viewplugin = {}
        },
        clickHandler: function(ev) {
            this.trigger("click", ev, this.model), this.toggleSelected(ev)
        },
        dragHandler: function(ev) {
            this.trigger("dragstop", ev, this.model)
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON())), this.model.get("ui_selected") === !0 ? this.$el.addClass("smallmediapod-selected") : this.$el.removeClass("smallmediapod-selected"), this.$el.find("ul.plevel-one").superfish({
                speed: "fast"
            });
            try {
                this.$el.draggable({
                    distance: 20,
                    revert: "invalid",
                    stack: ".mediabinitems div",
                    helper: "clone",
                    zIndex: 1e4,
                    appendTo: "body"
                })
            } catch (err) {}
            var self = this;
            return $.each(this.viewplugin, function(pluginName) {
                var an = $("<a>").html(self.viewplugin[pluginName].label).bind("click", function() {
                    $(window).trigger(self.viewplugin[pluginName].callBackEvent, self.model)
                });
                self.viewplugin[pluginName].el = $("<li>").html(an), $(self.el).find(".plevel-two").append(self.viewplugin[pluginName].el)
            }), $(this.el).data("backbone-view", this), this
        },
        toggleSelected: function() {
            var self = this;
            this.ui_select && self.model.toggle()
        },
        removeItem: function(ev) {
            ev.preventDefault(), this.model.destroy(), this.model.view.remove()
        },
        addContextPlugin: function(ev, pluginName, callBackEvent, label) {
            this.viewplugin[pluginName] = {
                callBackEvent: callBackEvent,
                label: label
            }, this.render()
        },
        remove: function() {
            this.$el.zoom()
        },
        removeView: function() {
            this.undelegateEvents(), this.$el.removeData().unbind(), this.remove(), Backbone.View.prototype.remove.call(this)
        }
    }), MediaBin.MainView = Backbone.View.extend({
        el: $("div#mediabin"),
        id: "mediabin",
        tagName: "div",
        className: "smallgriditem",
        events: {
            "click #cntmo_prtl_mediabin_dlt_lnk": "deleteSelected",
            "click #cntmo_prtl_mediabin_rmv_lnk": "removeSelected",
            "click #cntmo_prtl_mediabin_unselect_lnk": "unSelect",
            "click #cntmo_prtl_mediabin_srt_date": "sortByID",
            "click #cntmo_prtl_mediabin_srt_name": "sortByName",
            "click #cntmo_prtl_mediabin_clct_lnk": "addToCollection",
            drop: "dropped",
            dropactivate: "dropactivate",
            dropdeactivate: "dropdeactivate"
        },
        initialize: function(attributes) {
            this.mediabinitems = [], this.mediabinitems_obj = this.$el.find(".mediabinitems"), this.countTemplate = attributes.countTemplate, this.attributes = attributes, this.collection = this.attributes.collection, this.dummySpacer = $("<div>&nbsp;</div>").css("display", "inline-block"), _.bindAll(this, "addOne", "addAll", "render", "errorHandler", "updateUISize", "deleteEvent", "toggle", "noevent", "showOne", "raiseEvent", "dropped", "dropactivate", "dropdeactivate", "updateCount"), this.collection.bind("add", this.addOne), this.collection.bind("reset", this.addAll), this.collection.bind("resize", this.updateUISize), this.collection.bind("reset", this.render), this.collection.bind("all", this.updateCount), this.collection.bind("error", this.errorHandler), this.collection.bind("remove", this.updateUISize), this.collection.bind("remove", this.addAll), this.collection.bind("toggle", this.toggle), this.collection.bind("finishedAdding", this.noevent), this.collection.view = this, this.collection.fetch({
                reset: !0
            }), $.cookie("cntmo_mediabin") && this.show(), $(document).bind("keydown", "alt+b", this.toggle), $.subscribe("/cntmo/prtl/item/delete", this.deleteEvent), $.publish("/cntmo/prtl/MediaBin/ready")
        },
        noevent: function() {},
        raiseEvent: function(evtype, ev, model) {
            this.trigger(evtype, ev, model)
        },
        errorHandler: function() {
            $.growl("error trying to make request", "error")
        },
        addAll: function() {
            _.each(this.mediabinitems, function(itemview) {
                itemview.removeView()
            }), this.mediabinitems = [], this.mediabinitems_obj.html(""), this.collection.each(this.showOne), $("#mediabin").trigger("cntmo.prtl.MediaBinView.Event.addAll")
        },
        showOne: function(mediabinitem) {
            var self = this;
            self.attributes.itemtemplate === undefined && (self.attributes.itemtemplate = _.template($("#cntmo_prtl_mediabin-pod-tmpl").html()));
            var view = new MediaBin.MediaBinVSItemView({
                model: mediabinitem,
                template: self.attributes.itemtemplate,
                ui_select: self.attributes.ui_item_select
            });
            view.on("click", function(ev, model) {
                self.raiseEvent("view.click", ev, model)
            }), view.on("dragstop", function(ev, model) {
                self.raiseEvent("view.dragstop", ev, model)
            }), this.mediabinitems.push(view), this.mediabinitems_obj.append(view.render().el)
        },
        dropactivate: function() {
            this.mediabinitems_obj.width(this.mediabinitems_obj.width() + 120), $('<div class="smallmediapodDroppableTarget animated pulse"></div>').hide().appendTo(this.mediabinitems_obj).fadeTo(300, .7)
        },
        dropdeactivate: function() {
            var self = this;
            this.mediabinitems_obj.find(".smallmediapodDroppableTarget").fadeOut(300, function() {
                $(this).remove(), self.mediabinitems_obj.width(self.mediabinitems_obj.width() - 120)
            })
        },
        dropped: function(event, ui) {
            var nameOrID, self = this,
                $el = $(ui.draggable),
                $domEl = "",
                idsToAdd = [];
            this.mediabinitems_obj.find(".smallmediapodDroppableTarget").remove(), idsToAdd = $el.data("selectedIDs") !== undefined ? $el.data("selectedIDs") : [$el.attr("id")], _.each(idsToAdd, function(itemid) {
                "" !== itemid && ($domEl = $("#" + itemid), nameOrID = $domEl.find(".mediaitemtitle a").html() || itemid, self.collection.isInBin(itemid) === !1 ? self.collection.create({
                    resource_id: itemid,
                    resource_name: $domEl.find(".mediaitemtitle a").html(),
                    thumbnail_uri: $domEl.find("img.mediathumb").attr("src"),
                    parent_id: $domEl.data("parentitem"),
                    resource_type: $domEl.data("itemtype")
                }, {
                    error: function() {
                        $.growl("'" + nameOrID + "' " + gettext("could not be added"))
                    }
                }) : $.growl("'" + nameOrID + "' " + gettext("already in MediaBin"), "error"))
            })
        },
        addOne: function(mediabinitem) {
            this.showOne(mediabinitem), this.updateUISize()
        },
        updateCount: function() {
            $("#mediabin-tab-show .ntfcnttxt").html(this.collection.models.length), $("#mediabincount", this.el).html(this.countTemplate({
                selected_count: this.collection.getSelectedorAll().length
            })), this.collection.getSelected().length < 1 ? $("#cntmo_prtl_mediabin_unselect_lnk").parent("li").hide() : $("#cntmo_prtl_mediabin_unselect_lnk").parent("li").show(), this.collection.length < 1 ? $("#mediabin_cntx_menu").hide() : $("#mediabin_cntx_menu").show()
        },
        render: function() {
            this.updateUISize(), this.trigger("rendered"), this.$el.droppable({
                tolerance: "pointer",
                accept: ".mediaitem"
            }), this.$el.find(".viewport").selectable("destroy").selectable({
                delay: 100,
                distance: 10,
                filter: ".smallmediapod",
                selected: function(event, ui) {
                    $(ui.selected).click()
                }
            })
        },
        deleteEvent: function(itemid) {
            var modelsMatching, self = this;
            modelsMatching = this.collection.where({
                resource_id: itemid
            }), self.collection.remove(modelsMatching)
        },
        deleteSelected: function() {},
        removeSelected: function(ev) {
            return ev.preventDefault(), _.each(this.collection.getSelectedorAll(), function(mbi) {
                mbi.clear()
            }), !0
        },
        unSelect: function(ev) {
            ev.preventDefault(), _.each(this.collection.getSelectedorAll(), function(mbi) {
                mbi.toggle()
            })
        },
        addToCollection: function(event) {
            var IDs;
            event.preventDefault(), IDs = _.map(this.collection.getSelectedorAll(), function(mbi) {
                return mbi.get("resource_id")
            }), $LAB.script(cntmo.loadLocations.smartSelectBox).script(cntmo.loadLocations.addToCollection).wait(function() {
                new cntmo.prtl.Collection.addToCollection({
                    selected_objects: IDs,
                    library_selected: undefined,
                    ignore_list: []
                })
            })
        },
        sortByID: function(event) {
            event && event.preventDefault(), this.collection.comparator = function(collection) {
                return collection.get("id")
            }, this.collection.sort(), this.addAll()
        },
        sortByName: function(event) {
            event && event.preventDefault(), this.collection.comparator = function(m) {
                return m.get("resource_name")
            }, this.collection.sort(), this.addAll()
        },
        show: function(mbheight) {
            mbheight === undefined && (mbheight = 160), $.cookie("cntmo_mediabin") ? (this.$el.height("160px"), this.$el.css("visibility", "visible")) : (this.$el.css("visibility", "visible").animate({
                height: mbheight
            }, 250, "easeOutBounce"), $.cookie("cntmo_mediabin", "open", {
                expires: 7,
                path: "/"
            })), $("#main").length > 0 && $("#main").append(this.dummySpacer.height(mbheight))
        },
        hide: function() {
            this.$el.animate({
                height: "0px"
            }, 250, "swing").css("visibility", "hidden"), $.cookie("cntmo_mediabin", "open", {
                expires: -1,
                path: "/"
            }), this.dummySpacer.remove()
        },
        toggle: function() {
            this.$el.height() < 1 ? this.show() : this.hide()
        },
        updateUISize: function() {
            if (this.attributes.updateUISize !== !1) {
                var newMediaBinSize = 120 * this.collection.length;
                this.mediabinitems_obj.width(newMediaBinSize + "px"), $(document).width() < newMediaBinSize ? (this.$("#mediabinholder").data("plugin_tinyscrollbar") !== undefined ? this.$("#mediabinholder").data("plugin_tinyscrollbar").update() : this.tinyscrollbar = this.$("#mediabinholder").tinyscrollbar({
                    axis: "x"
                }), this.$(".scrollbar").show()) : this.$(".scrollbar").hide()
            }
        }
    })
}(cntmo.prtl.MediaBin = cntmo.prtl.MediaBin || {}, jQuery);
