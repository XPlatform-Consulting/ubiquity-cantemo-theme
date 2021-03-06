cntmo.prtl.ViewClass = Backbone.View.extend({
    render: function() {
        return this
    },
    hide: function(speed) {
        return this.$el.hide(speed), this.$el.addClass("hidden"), this
    },
    show: function(speed, renderifshowing) {
        return this.isHidden === !0 ? this.render() : (void 0 === renderifshowing || renderifshowing === !0) && this.render(), this.$el.show(speed), this.$el.removeClass("hidden"), this
    },
    isHidden: function() {
        return this.$el.hasClass("hidden")
    }
});
cntmo.prtl.ViewClassLoad = cntmo.prtl.ViewClass.extend({
    initialize: function(options) {
        void 0 === this.options && (this.options = options || {}), this.viewurl = this.options.url, _.bindAll(this, "render"), this.bind("render", this.render)
    },
    render: function() {
        this.$el.load(this.viewurl);
        this.$el.html("");

        return this;
    }
});
cntmo.prtl.views.ShapeManage = Backbone.View.extend({
    events: function() {
        var options = {
            "click .manage": "openManageDialog"
        };
        return options
    },
    initialize: function(args) {
        _.bindAll(this, "openManageDialog"), this.remote_url = $(args.el.target).attr("href"), this.title = $(args.el.target).data("shape-name"), this.openManageDialog()
    },
    openManageDialog: function() {
        var self = this;
        self.$manageDialog = $("<div></div>"), self.$manageDialog.load(this.remote_url).dialog({
            width: '80vw',
            modal: true,
            resizable: !1,
            dialogClass: "exportView",
            title: this.title,
            show: {
                effect: "fade",
                duration: 300
            },
            hide: {
                effect: "fade",
                duration: 300
            },
            close: function() {
                $(this).dialog("destroy").remove(), cntmo.prtl.panelviews.MediaItemFormatsPanel.timedGet()
            },
            buttons: [{
                text: gettext("Close"),
                click: function() {
                    $(".ui-dialog-content").dialog("close")
                },
                "class": "cancel-export-button ui-dialog-button-cancel"
            }]
        })
    },
    render: function() {
        return this
    },
    close: function() {
        void 0 !== this.$manageDialog && this.$manageDialog.dialog("close")
    }
});

(function(Item, $, undefined) {
    Item.MediaViewRouter = Backbone.Router.extend({
        initialize: function(options) {
            this.options = options || {}, this.parentView = options.parentView
        },
        routes: {
            "comments/c:id": "viewcomments"
        },
        viewcomments: function(id) {
            $("nav.mi_contextmenu a").find("selected").removeClass("selected"),
            $("a#mv_comments_a").panelMgr({
                contextMenu: "li",
                el: event.target,
                panelName: "mv_panel"
            }).addClass("selected"), setTimeout(function() {
                $(window).scrollTop($("#comment" + id).offset().top)
            }, 1e3)
        },
        clickPanel: function() {
            $("#mv_posters_a").click(),
            this.parentView.$el.find("#" + Backbone.history.fragment).click()
        }
    }), Item.MediaViewPage = Backbone.View.extend({
        events: {
            "click .disabled a": "disableHandler",
            "click #mi_contextmenu a": "clickPanelMenu",
            "click .add_to_collection": "addToCollection",
            "click .make_latest_version": "makeLatestVersion",
            "click .clone_item": "cloneItem",
            "click .upload_item_version": "uploadItemVersion",
            "click #delete_metadata": "clickDeleteMetadata",
            "click #exportitem": "exportItem",
            "click #returntoplaceholder": "returnToPlaceHolder",
            "click #archive_item": "archiveItem",
            "click #restore_item": "restoreItem",
            "click a#transcodeitem": "transcodeItem",
            "click a#relateitem": "relateItem",
            "click a.add_to_bin": "addToBin",
            "click a.share_item": "shareItem"
        },
        initialize: function(options) {
            this.options = options || {},
            this.model = options.model,
            this.definedurls = options.definedurls || {},
            this.panels = options.panels,
            this.message_strings = options.message_strings,
            this.router = new Item.MediaViewRouter({
                parentView: this
            }),
            this.initializePanelRouters(),
            options.initializePanels === !0 && this.model !== undefined && this.initializePanels(),
            this.views = {},
            $(".title_editable").editinplace();

            var self = this;
            var mainPlayer = $(cntmo.app.players.mainPlayer);
            if (mainPlayer.on("grabStill", function(ev, timeObject) { self.grabStill(ev, timeObject) }),
                cntmo.app.players !== undefined && cntmo.app.players.mainPlayer !== undefined)
            {
                var queryDict = {};
                location.search.substr(1).split("&").forEach(function(item) {
                    queryDict[item.split("=")[0]] = item.split("=")[1]
                }),
                queryDict.hasOwnProperty("startTimecode") &&
                $(cntmo.app.players.mainPlayer.timeline.currentClip().video).on("canplay", function() {
                    cntmo.app.players.mainPlayer.setCurrentTC(new Timecode({
                        smpte: queryDict.startTimecode
                    }))
                })
            }
            Backbone.history.start({
                root: this.definedurls.this
            });
        },
        initializePanels: function() {
            cntmo.prtl.panelviews = this.panels
        },
        initializePanelRouters: function() {
            var self = this;
            self.$el.find("#mi_contextmenu a").each(function(idx, el) {
                $(el).is("[shortcut]") || $(el).attr("shortcut", "shortcut" + $(el).attr("id")),
                self.router.route($(el).attr("shortcut"), function() {
                    $(document).ready(function() {
                        self.$el.find("#mi_contextmenu").find('[shortcut="' + Backbone.history.fragment + '"]').click()
                    })
                })
            })
        },
        disableHandler: function(event) {
            return event.preventDefault(), event.stopImmediatePropagation(), !1
        },
        clickPanelMenu: function(event) {
            return $(event.target).panelMgr({
                contextMenu: "li",
                el: event.target,
                panelName: "mv_panel"
            }), $(event.target).is("[shortcut]") ? this.router.navigate($(event.target).attr("shortcut"), {
                trigger: !1,
                replace: !0
            }) : this.router.navigate($(event.target).attr("id"), {
                trigger: !1,
                replace: !0
            }), !1
        },
        addToBin: function(event) {
            event.preventDefault();
            var self = this;
            if (0 == cntmo.app.page.mediaBinItems.isInBin(self.model.get("id"))) try {
                cntmo.app.page.mediaBinItems.create({
                    resource_id: self.model.get("id"),
                    resource_name: self.model.get("resource_name"),
                    resource_type: self.model.get("resource_type"),
                    thumbnail_uri: self.model.get("thumbnail_uri")
                }, {
                    success: function() {
                        $.publish("/cntmo/prtl/MediaBin/finishedAdding")
                    },
                    error: function() {
                        $.growl(gettext("Could not add item to bin"), "error")
                    }
                })
            } catch (err) {
                alert(err)
            } else $.growl(gettext("Item is already in MediaBin"), "error")
        },
        shareItem: function(event) {
            event.preventDefault();
            var self = this;
            cntmo.prtl.Sharing.share(self.model.get("id"), {
                definedurls: self.definedurls
            })
        },
        grabStill: function(event, timeObject) {
            event.preventDefault();
            var tc = timeObject.toSMPTE(),
                self = this;
            $.ajax({
                url: self.definedurls.grabstill,
                data: {
                    smptetimecode: tc
                },
                type: "POST",
                success: function(data) {
                    $.growl(data.message, "success")
                },
                error: function(data) {
                    $.growl(data.data, "error")
                }
            })
        },
        transcodeItem: function(event) {
            event.preventDefault(), this.definedurls.transcodeurl !== undefined && $("#transcodepanel").load(this.definedurls.transcodeurl)
        },
        relateItem: function(event) {
            event.preventDefault();
            var self = this;
            this.$el.find("#relateholder").load(self.definedurls.searchajax), $(".mediaitemgridmini").live("click", function() {
                $(this).toggleClass("mediaitem-selected");
                var mediaitemid = $(this).attr("id");
                $("#searchresultschoices").html('<button id="makerelation" class="button">Make relation</button>'), $("#makerelation").live("click", function(e) {
                    e.preventDefault(), $.ajax({
                        url: self.definedurls.createitemrelationship,
                        data: {
                            source: self.model.get("id"),
                            target: mediaitemid
                        },
                        type: "GET",
                        success: function() {
                            0 == item_has_relations && ($("#relationstbl tbody").append('<tr class="heading"><th></th><th>Item</th><th>Direction</th><th>Item</th></tr>'), $("#no_relations_text").remove(), item_has_relations = !0), $("#relationstbl tr:last").after('<tr><td></td><td>{{ item.getId }}</td><td>U</td><td><a href="/vs/item/' + mediaitemid + '/">' + mediaitemid + "</a></td></tr>")
                        }
                    })
                })
            })
        },
        returnToPlaceHolder: function(event) {
            event.preventDefault();
            confirm(gettext("Are you sure that you want to turn this item back into a placeholder. Files will not be deleted")) && $.ajax({
                url: this.definedurls.returntoplaceholderurl,
                type: "DELETE",
                success: function() {
                    confirm(gettext("Turning back to placeholder was successful, do you want to reload the current page?")) && document.location.reload(!0)
                },
                error: function(data) {
                    $.growl(data.responseText)
                }
            })
        },
        exportItem: function(event) {
            if (event.preventDefault(), !$(event.target).data("disabled")) {
                var self = this,
                    standardOptions = {
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
                        close: function() {
                            $(this).dialog("destroy").remove()
                        },
                        buttons: [{
                            text: gettext("Export"),
                            click: function() {
                                $("#export_ajax_form").submit()
                            },
                            "class": "send-export-button ui-dialog-button-confirm"
                        }, {
                            text: gettext("Cancel"),
                            click: function() {
                                $(".ui-dialog-content").dialog("close")
                            },
                            "class": "cancel-export-button ui-dialog-button-cancel"
                        }]
                    };
                self.$dialogEl = $("<div></div>"), self.$dialogEl.load(self.definedurls.exporturl).dialog(standardOptions), self.$dialogEl.on("change", ".ftpuri", function(event) {
                    val = $(event.currentTarget).val();
                    var filename_override = $(event.currentTarget).find("option[value='" + val + "']").attr("filename_override");
                    "true" === filename_override ? $(event.currentTarget).parents("form").find(".exportfilenamediv").show() : $(event.currentTarget).parents("form").find(".exportfilenamediv").hide()
                })
            }
        },
        archiveItem: function(event) {
            event.preventDefault(), itemId = $("#archive_item").attr("ref"), $.ajax({
                type: "POST",
                url: "/archive_framework/" + itemId + "/archive/",
                success: function() {
                    $.growl(gettext("Item queued for archival"), "success")
                },
                error: function(jqxhr) {
                    $.growl(jqxhr.responseText, "error")
                }
            })
        },
        restoreItem: function(event) {
            event.preventDefault(), itemId = $("#restore_item").attr("ref"), $.ajax({
                type: "POST",
                url: "/archive_framework/" + itemId + "/restore/",
                success: function() {
                    $.growl(gettext("Item queued for restore"), "success")
                },
                error: function(jqxhr) {
                    $.growl(jqxhr.responseText, "error")
                }
            })
        },
        uploadItemVersion: function(event) {
            event.preventDefault();
            var self = this,
                standardOptions = {
                    width: 600,
                    modal: !0,
                    resizable: !1,
                    dialogClass: "uploadView",
                    title: gettext("Upload new version"),
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
                        text: gettext("Upload"),
                        click: function() {
                            $(".plupload_start").click();
                            var dialog = $(this).dialog("option", "buttons", []),
                                uploader = $("#uploader").pluploadQueue();
                            uploader.bind("UploadComplete", function() {
                                dialog.dialog("option", "buttons", [{
                                    text: gettext("Done"),
                                    "class": "send-export-button ui-dialog-button-confirm",
                                    click: function() {
                                        $(".ui-dialog-content").dialog("close")
                                    }
                                }])
                            })
                        },
                        "class": "send-export-button ui-dialog-button-confirm"
                    }, {
                        text: gettext("Cancel"),
                        click: function() {
                            $(".ui-dialog-content").dialog("close")
                        },
                        "class": "cancel-export-button ui-dialog-button-cancel"
                    }]
                };
            self.$dialogEl = $("<div></div>"), self.$dialogEl.load(self.definedurls.uploaditem).dialog(standardOptions)
        },
        addToCollection: function(event) {
            var self = this,
                ID = self.model.id;
            event.preventDefault(), event.stopPropagation(), $LAB.script(cntmo.loadLocations.addToCollection).wait(function() {
                new cntmo.prtl.Collection.addToCollection({
                    collectionaddbuttontext: gettext("Add To Collection"),
                    collectioncancelbuttontext: gettext("Cancel"),
                    title: gettext("Add To Collection"),
                    selected_objects: [ID],
                    library_selected: undefined,
                    ignore_list: []
                })
            })
        },
        clickDeleteMetadata: function(event) {
            event.preventDefault(), confirm(gettext("Do you really want to remove the metadata group from this item?")) && (document.location.href = this.definedurls.removemetadataurl)
        },
        makeLatestVersion: function(event) {
            event.preventDefault();
            var self = this,
                standardOptions = {
                    width: 600,
                    modal: !0,
                    resizable: !1,
                    dialogClass: "makeLatestVersionView",
                    title: gettext("Make into latest version"),
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
                        text: gettext("Submit"),
                        click: function() {
                            $("#make_latest_ajax_form").submit(), $(".ui-dialog-content").dialog("close")
                        },
                        "class": "send-export-button ui-dialog-button-confirm"
                    }, {
                        text: gettext("Cancel"),
                        click: function() {
                            $(".ui-dialog-content").dialog("close")
                        },
                        "class": "cancel-export-button ui-dialog-button-cancel"
                    }]
                };
            self.$dialogEl = $("<div></div>");
            var url;
            try {
                url = $(event.currentTarget).attr("href")
            } catch (err) {
                url = self.definedurls.makelatestversionurl
            }(url === undefined || "" === url) && (url = self.definedurls.makelatestversionurl), self.$dialogEl.load(url).dialog(standardOptions)
        },
        cloneItem: function(event) {
            event.preventDefault();
            var self = this,
                standardOptions = {
                    width: 600,
                    modal: !0,
                    resizable: !1,
                    dialogClass: "cloneItemView",
                    title: gettext("Clone to new item"),
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
                        text: gettext("Clone"),
                        click: function() {
                            $("#clone_ajax_form").submit()
                        },
                        "class": "send-export-button ui-dialog-button-confirm"
                    }, {
                        text: gettext("Cancel"),
                        click: function() {
                            $(".ui-dialog-content").dialog("close")
                        },
                        "class": "cancel-export-button ui-dialog-button-cancel"
                    }]
                };
            self.$dialogEl = $("<div></div>"), self.$dialogEl.load(self.definedurls.cloneitemurl).dialog(standardOptions)
        }
    }),
    Item.MediaItemThumbnailPanel = cntmo.prtl.ViewClassLoad.extend({
        render: function() {
            // a silly way of calling the parent methods, but whatever
            this.constructor.__super__.render.call(this);
            this.$el.css("display", "flex");

            return this;
        }
    }),
    Item.MediaItemPreviewPanel = cntmo.prtl.ViewClass.extend({
        initialize: function() {
            this.constructor.__super__.initialize.call(this);
            this.adjustDisplay();
        },
        render: function() {
            this.constructor.__super__.render.call(this);

            return this;
        },
        show: function() {
            this.constructor.__super__.show.call(this);
            this.adjustDisplay();

            return this;
        },
        hide: function() {
            this.constructor.__super__.hide.call(this);
            this.$el.parent().removeAttr('style');

            return this;
        },
        adjustDisplay: function() {
            this.$el.css("display", "flex");
            this.$el.parent().css('padding', '0');
        }
    }),
    Item.MediaItemPosterPanel = cntmo.prtl.ViewClassLoad.extend({
        render: function() {
            this.constructor.__super__.render.call(this);
            this.$el.css("display", "flex");

            return this;
        }
    }),
    Item.MediaItemMetadataPanel = cntmo.prtl.ViewClass.extend(),
    Item.MediaItemVersionsPanel = cntmo.prtl.ViewClass.extend({
        el: "div",
        initialize: function(options) {
            this.options = options || {};
            this.collection = new Backbone.Collection([], {
                url: this.options.url
            });
            _.bindAll(this, "render", "closeViewPanel");
            this.collection.bind("add", this.addOne);
            this.collection.bind("reset", this.addAll);
            this.bind("render", this.render);
            this.$el = $("#versions-menu");
            this.url = options.url || "versions/";
            this.currentSelectedVersion = options.currentSelectedVersion || "";
        },
        render: function() {
            var self = this,
                url = self.url;
            self.$el.removeClass("hidden").show(),
            self.$el.find("container").html(""),
            $("#mi_contextmenu").on("click", "a", function() {
                self.closeViewPanel()
            }), "" !== self.currentSelectedVersion &&
                (url += "?currentSelectedVersion=" + self.currentSelectedVersion),
                $.ajax(url, {
                    beforeSend: function() {
                        $(".loading-icon").show(), $("#media-info-card").hide()
                    },
                    success: function(data) {
                        $(".loading-icon").hide(), self.$el.find(".versions").html(data), self.$el.show()
                    },
                    error: function() {
                        $.growl("There was an error loading up versions", "error"),
                        $(".loading-icon").hide(),
                        self.$el.find(".versions").html("")
                    }
            })
        },
        closeViewPanel: function() {
            return $("#mi_contextmenu").off("click", "a"), $("#media-info-card").show(), !0
        }
    }),
    Item.MediaItemFormatsPanel = cntmo.prtl.ViewClass.extend({
        initialize: function(options) {
            this.options = options || {}, this.collection = new cntmo.prtl.Item.ShapeCollection([], {
                url: this.options.url
            }),
            _.bindAll(this, "addOne", "addAll", "render"),
            this.collection.bind("add", this.addOne),
            this.collection.bind("reset", this.addAll),
            this.bind("render", this.render)
        },
        render: function() {
            return this.collection.fetch({
                success: function() {
                    this.$("td.imgpreloader").hide()
                }
            }), this
        },
        addOne: function(shape) {
            var view = new cntmo.prtl.Item.ShapeView({
                model: shape
            });
            this.$("#cntmo_prtl_mediaitem_shape_table").append(view.render().el)
        },
        addAll: function() {
            var self = this,
                preloader = self.$("#cntmo_prtl_mediaitem_shape_table").find(".imgpreloader");
            preloader.parent().siblings().remove(), preloader.hide(), this.collection.where({
                filesize: ""
            }).length > 0 || this.collection.where({
                filesize: "-1 bytes"
            }).length > 0 ? self.timer === undefined && self.timedGet() : self.timer !== undefined && self.clearTimer(), this.collection.each(this.addOne)
        },
        clearTimer: function() {
            clearInterval(this.timer)
        },
        timedGet: function() {
            var self = this;
            self.timer !== undefined && self.clearTimer(), self.timer = setInterval(function() {
                self.collection.fetch({
                    success: function() {
                        self.addAll()
                    }
                })
            }, 5e3)
        }
    }),
    Item.MediaItemRelatedPanel = cntmo.prtl.ViewClassLoad.extend({
        render: function() {
            var self = this;
            return $.ajax({
                url: this.options.url,
                beforeSend: function() {
                    self.loadingicon = $('<div class="loading" style="margin: 20px auto;font-weight:700;width: 200px; text-align:center;">').html($(".loading-icon").html()), self.$el.find(".related_wrapper").html(self.loadingicon)
                },
                error: function(jqXHR) {
                    self.$el.find(".related_wrapper").html(""), $.growl(jqXHR.data, "error")
                },
                success: function(data) {
                    self.$el.find(".related_wrapper").html(data).find(".relatedpanelcontent").accordion({
                        collapsible: !0,
                        active: !1
                    })
                }
            }), this
        }
    }),
    Item.MediaItemHistoryPanel = cntmo.prtl.ViewClass.extend({
        initialize: function(options) {
            this.options = options || {}, this.collection = new cntmo.prtl.Item.JobCollection([], {
                url: this.options.url
            }),
            _.bindAll(this, "addOne", "addAll", "render"),
            this.collection.bind("add", this.addOne),
            this.collection.bind("reset", this.addAll),
            this.bind("render", this.render)
        },
        render: function() {
            return this.collection.fetch({
                reset: !0,
                success: function() {
                    this.$("td.imgpreloader").hide()
                }
            }), this
        },
        addOne: function(job) {
            var view = new cntmo.prtl.Item.HistoryView({
                model: job
            });
            this.$("#jobstbl").append(view.render().el)
        },
        addAll: function() {
            this.$("#jobstbl tbody").html(""), this.collection.each(this.addOne)
        }
    }),
    Item.MediaItemACLPanel = cntmo.prtl.ViewClass.extend({
        events: {
            "click #aclmanage": "loadacladd",
            "click #addpermbut": "addNewACL",
            "click #showhideaudit": "showAudit"
        },
        initialize: function(options) {
            this.options = options || {}, this.collection = new cntmo.prtl.Item.ACLCollection([], {
                url: this.options.url
            }), _.bindAll(this, "addOne", "addAll", "render"), this.collection.bind("add", this.addOne), this.collection.bind("reset", this.addAll)
        },
        render: function() {
            return this.collection.fetch({
                success: function() {
                    this.$("td.imgpreloader").hide()
                }
            }), this.auditshowing = !1, this.$("#aclmanage").show(), this
        },
        addOne: function(ACL) {
            var view = new cntmo.prtl.Item.ACLView({
                model: ACL
            });
            this.$("#access_rights tbody").append(view.render().el)
        },
        addAll: function() {
            this.$("#access_rights tbody").html(""), this.collection.each(this.addOne)
        },
        loadacladd: function(ev) {
            var self = this;
            0 == self.$("#access_rights tfoot").find(".inlineACLEditor").length && $.get($(ev.currentTarget).attr("rel"), function(data) {
                self.$("#access_rights tfoot").append(data)
            })
        },
        showAudit: function(ev) {
            var self = this,
                beforeText = self.$("#showhideaudit").attr("before"),
                afterText = self.$("#showhideaudit").attr("after");
            self.auditshowing === !1 ? (self.auditshowing = !0, $.get($(ev.currentTarget).attr("rel"), function(data) {
                self.$("#aclmanage").fadeOut("fast"), self.$("table#access_rights").fadeOut(250, function() {
                    self.$("table#audit_access_rights").find("tbody").html(data), self.$("table#audit_access_rights").fadeIn(250)
                }), self.$("#showhideaudit").find("button").html(afterText)
            })) : (self.auditshowing = !1, self.$("table#audit_access_rights").fadeOut(250, function() {
                self.$("table#access_rights").fadeIn(500), self.render(), self.$("#aclmanage").fadeIn("fast")
            }), self.$("table#audit_access_rights").hide(), self.$("#showhideaudit").find("button").html(beforeText))
        },
        addNewACL: function() {
            var recipient = this.$("#id_recipient").val();
            perm = this.$("#id_permission").val(), user = "", group = "", "user_" == recipient.substr(0, 5) ? user = recipient.slice(5) : group = recipient.slice(6), this.collection.create({
                user: user,
                group: group,
                permission: perm
            }, {
                error: function() {
                    $.growl(gettext("Could not add item"), "error")
                }
            })
        }
    }),
    Item.MediaItemCommentsPanel = cntmo.prtl.ViewClass.extend({
        tagName: "div",
        events: {
            "click .submit-post": "submitForm",
            "click .replyToComment": "replyToComment",
            "click .deleteComment": "deleteComment",
            "click .commentEditable": "editComment"
        },
        initialize: function(options) {
            this.options = options || {}, _.bindAll(this, "render", "submitForm", "replyToComment")
        },
        render: function() {
            var url;

            if (this.options.share !== undefined) {
                url = this.options.url +
                      "?asset_id=" + this.options.share.asset_id +
                      "&email_address=" + this.options.share.email_address +
                      "&unique_key=" + this.options.share.unique_key;
            } else {
                url = this.options.url;
            }

            this.$el.find(".comments_wrapper").load(url);

            return this;
        },
        submitForm: function(event) {
            event.preventDefault(event);
            var self = this;
            return this.$el.find("#commentsCommentForm").ajaxSubmit({
                dataType: "json",
                success: function() {
                    self.render(), $(".commentsCommentCount").length > 0 && $.ajax({
                        url: self.options.url + "?count",
                        dataType: "json",
                        type: "GET",
                        success: function(responseText) {
                            $(".commentsCommentCount").html("(" + responseText.count + ")")
                        }
                    })
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    var error_text = "";
                    try {
                        error_text = JSON.parse(jqXHR.responseText).detail
                    } catch (err) {
                        JSON.parse(jqXHR.responseText).detail, error_text = errorThrown
                    }
                    self.$el.find(".commentsCommentError").addClass("errormessage").html("<p>" + error_text + "</p>")
                }
            }), this
        },
        fullDeleteComment: function(event) {
            event.preventDefault(event);
            var commentsCommentCount = "",
                targetEl = $(event.target);
            $.ajax({
                url: "/comments/comment/" + targetEl.attr("rel"),
                type: "DELETE",
                dataType: "json",
                success: function() {
                    $("#comment" + targetEl.attr("rel")).fadeOut().remove();
                    var commentlength = $(".comment").length - 1;
                    commentlength > 0 && (commentsCommentCount = "(" + commentlength + ")"), $(".commentsCommentCount").html(commentsCommentCount)
                },
                error: function(data) {
                    $.growl(data.data, "error")
                }
            })
        },
        editComment: function(event) {
            event.preventDefault(event);
            var cancelButton, updateButton, buttonWrapper, textarea, self = this,
                targetEl = $(event.target),
                html = targetEl.html();
            console.log(targetEl);
            targetEl.hasClass("commentEditable") && targetEl.find("textarea.commentEditing").length < 1 && (textarea = $("<textarea>").html(html),
            buttonWrapper = $('<div class="buttonWrapper">'),
            cancelButton = $('<input type="reset" class="comment-canceledit" value="' + gettext("Cancel") + '">').on("click", function(event) {
                event.preventDefault(), targetEl.html(html)
            }),
            updateButton = $('<input type="submit" class"comment-update" value="' + gettext("Update") + '">').on("click", function(event) {
                event.preventDefault();
                var comment_data = {
                    comment: textarea.val()
                };
                self.options.share !== undefined && (comment_data.share = self.options.share), $.ajax({
                    url: "/comments/comment/" + targetEl.attr("rel") + "/",
                    type: "PATCH",
                    data: JSON.stringify(comment_data),
                    dataType: "json",
                    contentType: "application/json",
                    success: function() {
                        self.render()
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        var error_text;
                        try {
                            error_text = JSON.parse(jqXHR.responseText).detail
                        } catch (err) {
                            JSON.parse(jqXHR.responseText).detail, error_text = errorThrown
                        }
                        $.growl(error_text, "error")
                    }
                }), $(this).off()
            }),
            textarea.addClass("commentEditing"), buttonWrapper.append(updateButton, cancelButton), targetEl.html(textarea).append(buttonWrapper))
        },
        deleteComment: function(event) {
            event.preventDefault(event);
            var targetEl = $(event.target);
            $.ajax({
                url: "/comments/comment/" + targetEl.attr("rel"),
                type: "PATCH",
                data: {
                    comment: gettext("-- Comment Removed --"),
                    is_removed: !0
                },
                dataType: "json",
                success: function() {
                    $("#comment" + targetEl.attr("rel")).find("main").html(gettext("-- User Deleted Comment ---"))
                },
                error: function(data) {
                    $.growl(data.data, "error")
                }
            })
        },
        replyToComment: function(event) {
            event.preventDefault(event);
            var self     = this;
            var targetEl = $(event.target);

            console.log(this);

            self.$commentForm === undefined && (self.$commentForm = self.$el.find(".commentsCommentFormWrapper")),
            self.$commentDiv !== undefined && (self.$commentDiv.find(".commentsCommentFormWrapper").remove(), self.$commentDiv = undefined),
            self.$commentDiv = $("#" + targetEl.attr("ref")),
            self.$commentDiv.find(".commentsCommentFormInlineHolder").append(self.$commentForm.clone()),
            self.$commentDiv.find("#commentsCommentForm").append('<input type="hidden" name="parent" value="' + targetEl.attr("rel") + '">')
        }
    }),
    Item.ShapeView = Backbone.View.extend({
        tagName: "tr",
        events: {
            "click .remove": "removethis",
            "click .manage": "managethis",
            mouseenter: "hoverin",
            mouseleave: "hoverout",
            "mouseenter .shapeformat": "showextraformatinfo",
            "mouseleave .shapeformat": "removeextraformatinfo"
        },
        initialize: function() {
            this.template = _.template($("#cntmo_prtl_mediaitem_format_tmpl").html()), _.bindAll(this, "render"),
            this.model.bind("change", this.render),
            this.model.view = this, this.$cnxtualMenu = ""
        },
        hoverin: function() {
            this.$el.find(".hidden").fadeIn(250)
        },
        hoverout: function() {
            this.$el.find(".hidden").fadeOut(50)
        },
        showextraformatinfo: function() {
            var mimetype = this.model.get("mimetype");

            if (-1 != mimetype.indexOf("image") ||
                -1 != mimetype.indexOf("video") ||
                -1 != mimetype.indexOf("audio") ||
                -1 != mimetype.indexOf("application/mxf")) {
                    // Have to use the .offset() method because chrome and webkit rendering hierarchy
                    //  doesn't respect parental position with position: relative when using .position()
                    var _tr_pos = this.$el.offset();
                    var _pos = this.$cnxtualMenu.parent("td").offset();
                    var _pos_left = ((_pos.left - _tr_pos.left - 16) + "px");
                    var _pos_top = ((_pos.top - _tr_pos.top - 20) + "px");

                    this.$cnxtualMenu.addClass("cnxtualMenu-show");
                    this.$cnxtualMenu.css({
                        "left": _pos_left,
                        "top": _pos_top
                    });
            }
        },
        removeextraformatinfo: function() {
            this.$cnxtualMenu.removeClass("cnxtualMenu-show")
        },
        removethis: function(ev) {
            ev.preventDefault(ev);
            var godelete = confirm(gettext("Are you sure you want to delete?"));
            godelete && this.model.clear()
        },
        managethis: function(ev) {
            ev.preventDefault(ev), this.popup = new cntmo.prtl.views.ShapeManage({
                el: ev
            })
        },
        render: function() {
            return this.$el.html(this.template(this.model.toJSON())),
                    "iPad" === navigator.platform ||
                    "iPhone" === navigator.platform ||
                    "iPod" === navigator.platform ? displayLength = 10 : this.$el.find(".hidden").removeClass("hidden"),
                    this.$cnxtualMenu = this.$el.find(".cnxtualMenu"),
                    this.$cnxtualMenu_arrow = this.$el.find(".cnxtualMenu_arrow"),
                    this.$panelFormat = document.querySelector("#panel_format"),
                    this
        }
    }),
    Item.HistoryView = Backbone.View.extend({
        tagName: "tr",
        initialize: function() {
            this.template = _.template($("#cntmo_prtl_mediaitem_history_tmpl").html()),
            _.bindAll(this, "render"),
            this.model.bind("change", this.render),
            this.model.view = this
        },
        render: function() {
            return this.$el.html(this.template(this.model.toJSON())),
                    "iPad" === navigator.platform || "iPhone" === navigator.platform || "iPod" === navigator.platform ? displayLength = 10 : this.$el.find(".hidden").removeClass("hidden"),
                    this
        }
    }),
    Item.ACLView = Backbone.View.extend({
        tagName: "tr",
        events: {
            "click .remove": "removethis",
            mouseenter: "hoverin",
            mouseleave: "hoverout"
        },
        hoverin: function() {
            this.$el.find(".hidden").fadeIn(250)
        },
        hoverout: function() {
            this.$el.find(".hidden").fadeOut(50)
        },
        removethis: function(e) {
            e.preventDefault(), this.model.clear()
        },
        initialize: function() {
            this.template = _.template($("#cntmo_prtl_mediaitem_acl_tmpl").html()), _.bindAll(this, "render"), this.model.bind("change", this.render), this.model.view = this
        },
        render: function() {
            return this.$el.html(this.template(this.model.toJSON())), "iPad" === navigator.platform || "iPhone" === navigator.platform || "iPod" === navigator.platform ? displayLength = 10 : this.$el.find(".hidden").removeClass("hidden"), this
        }
    })
}(cntmo.prtl.Item = cntmo.prtl.Item || {}, jQuery));
