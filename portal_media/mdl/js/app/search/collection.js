! function (Search) {
    Search.SearchSelectedCollection = Backbone.Collection.extend({
        model: cntmo.vs.VSItem
    }), Search.SearchunSelectedCollection = Backbone.Collection.extend({
        model: cntmo.vs.VSItem
    }), Search.PodPreviewCollection = Backbone.Collection.extend({
        model: cntmo.vs.VSItem
    }), Search.SearchCollection = Backbone.Collection.extend({
        model: cntmo.vs.VSItem,
        url: "/API/v1/item/search/",
        page: 1,
        current_page: 0,
        total_count: 0,
        initialize: function () {
            this.current_page = 0, this.first_on_page = 0, this.has_other_pages = !1, this.has_next = !1, this.has_previous = !1, this.last_on_page = !1, this.next = 0, this.pages = 0, this.pagination_amount = 0, this.previous = 0, this.total_count = 0
        },
        parse: function (response) {
            return this.current_page = response.meta.current_page, this.first_on_page = response.meta.first_on_page, this.has_other_pages = response.meta.has_other_pages, this.has_next = response.meta.has_next, this.has_previous = response.meta.has_previous, this.last_on_page = response.meta.last_on_page, this.next = response.meta.next, this.pages = response.meta.pages, this.pagination_amount = response.meta.pagination_amount, this.previous = response.meta.previous, this.total_count = response.meta.total_count, response.objects
        }
    })
}(cntmo.prtl.Search = cntmo.prtl.Search || {}, jQuery);
