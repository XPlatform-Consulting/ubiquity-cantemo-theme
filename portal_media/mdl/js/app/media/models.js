! function(Item, $, undefined) {
    Item.Item = Backbone.Model.extend({
        defaults: {
            ui_selected: !1,
            resource_uri: "",
            absolute_url: "",
            resource_type: "",
            thumbnail_uri: "",
            parent_id: "",
            name: "",
            user: ""
        },
        url: function() {
            return this.get("resource_uri") || this.collection.url
        },
        toggle: function() {
            this.set({
                ui_selected: !this.get("ui_selected")
            })
        },
        clear: function() {
            var self = this;
            this.destroy({
                success: function() {
                    self.view.remove()
                },
                error: function(model, response) {
                    $.growl(response.responseText, "error")
                },
                wait: !0
            })
        },
        parse: function(response) {
            return ("" === response.absolute_url || response.absolute_url === undefined) && (response.absolute_url = "/vs/item/", response.absolute_url += response.resource_id !== undefined ? response.resource_id + "/" : response.id + "/"), response
        }
    }), Item.JobItem = Backbone.Model.extend({}), Item.Shape = Backbone.Model.extend({
        defaults: {
            id: "",
            name: "",
            filename: "",
            filesize: "",
            json_object: "",
            format: "",
            download_uri: ""
        },
        url: function() {
            return "" !== this.id ? this.collection.url + this.id + "/" : this.collection.url
        },
        clear: function() {
            var self = this;
            this.destroy({
                success: function() {
                    self.view.remove()
                },
                error: function(model, response) {
                    $.growl(response.responseText, "error")
                }
            })
        }
    }), Item.ACL = Backbone.Model.extend({
        defaults: {
            id: "",
            user: "",
            group: "",
            permission: "",
            recursive: ""
        },
        url: function() {
            return "" !== this.id ? this.collection.url + this.id + "/" : this.collection.url
        },
        clear: function() {
            var self = this;
            this.destroy({
                success: function() {
                    self.view.remove()
                },
                error: function(model, response) {
                    $.growl(response.responseText, "error")
                }
            })
        }
    })
}(cntmo.prtl.Item = cntmo.prtl.Item || {}, jQuery), cntmo.vs.VSItem = cntmo.prtl.Item.Item, cntmo.vs.VSSequence = cntmo.vs.VSItem.extend({
    initialize: function() {}
});
