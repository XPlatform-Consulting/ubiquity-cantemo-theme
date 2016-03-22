! function (MediaBin) {
    MediaBin.MediaBinCollection = Backbone.Collection.extend({
        model: cntmo.vs.VSItem,
        url: "/mediabin/",
        parse: function (data) {
            return data
        },
        initialize: function () {},
        comparator: function (collection) {
            return collection.get("order")
        },
        getSelected: function () {
            return this.filter(function (collection) {
                return collection.get("ui_selected")
            })
        },
        getSelectedorAll: function () {
            return 0 === this.getSelected().length ? this.models : this.getSelected()
        },
        isInBin: function (resource_id) {
            return _.include(this.pluck("resource_id"), resource_id)
        }
    })
}(cntmo.prtl.MediaBin = cntmo.prtl.MediaBin || {}, jQuery);
